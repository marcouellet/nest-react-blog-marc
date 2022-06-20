import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CancelButton from '../common/cancelConfirmation'
import { ICategory, IUpdateCategory, createCategoryForUpdate, minimumCategoryTitleLength, 
          minimumCategoryDescriptionLength } from "../../types";
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors } from '../../types';
import { checkUnauthorized, checkForbidden } from '../../utils/response';
import { createActionSessionExpired } from '../../reducers/auth';

const EditCategory = () => {

  const navigate = useNavigate();
  const { state: { isLoading }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const { userId } = useParams<{ userId: string }>();
  const [category, setCategory] = useState<ICategory>();
 
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Category title is required')
      .min(minimumCategoryTitleLength, `Category title must be at least ${minimumCategoryTitleLength} characters long`),
    description: Yup.string().required('Description is required')
      .min(minimumCategoryDescriptionLength, `Description must be at least ${minimumCategoryDescriptionLength} characters long`),
  });

  type UpdateSubmitForm = {
    title: string;
    description: string;
  };

  const defaultValues = {title: category?.title, description: category?.description };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty }
  } = useForm<UpdateSubmitForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (!category) {
      const fetchData = async (): Promise<void> => {
        dispatch(createActionLoading(true));
        await CategoryApiService.getCategoryById(userId!)
        .then((category) => { setCategory(category); reset(category);})
        .catch((apiErrors: IErrors) => handleFetchCategoryError(apiErrors));
        dispatch(createActionLoading(false));
       }
      fetchData();      
    }
  // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: UpdateSubmitForm) => {
    if (category && isDirty) {
      dispatch(createActionLoading(true));
      const userData: IUpdateCategory = createCategoryForUpdate({...category, ...data});
      await CategoryApiService.updateCategory(category.id!, userData)
      .then(() => { handleSubmitFormSucess(); })
      .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
      dispatch(createActionLoading(false));
     }
  } 

  const handleFetchCategoryError = (apiErrors: IErrors) => {
    toast.error(`Category reading failed, see error list`);
    setErrorList(apiErrors);
  }

  const handleSubmitFormSucess = () => {
    toast.success(`Category updated successfully...`);
    navigate('/category'); 
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`Category update failed, session expired`);
      dispatch(createActionSessionExpired());
      navigate('/category'); 
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else {
      toast.error(`Category update failed, see error list`);
      setErrorList(apiErrors);      
    }
}

const cancelEditCategoryMessage = () => `category edition and loose changes`;

const handleResetEditCategory = () => {
  reset(defaultValues, { keepDirty: false});
}

const handleCancelEditCategory = () => {
  navigate('/category');   
};

  return (
    <div className={'page-wrapper'}>
    {category &&
      (
        <div className={"col-md-12 form-wrapper"}>
          <h2> Edit Category  </h2>
          {errorList && <ListErrors errors={errorList} />}
          <form id={"create-user-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
            <div className="form-group col-md-12">
              <label htmlFor="title"> Title </label>
              <input 
                type="text"
                placeholder="Enter title"
                {...register('title')}
                className={`form-control ${errors.title ? 'is-invalid' : ''}`} 
              />
              <div className="invalid-feedback">{errors.title?.message}</div>
           </div>

            <div className="form-group col-md-12">
              <label htmlFor="description"> Email </label>
              <input 
                type="text" 
                placeholder="Enter description"
                {...register('description')}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
              />
              <div className="invalid-feedback">{errors.description?.message}</div>
            </div>

            <div className="form-group col-md-4 pull-right">
              <button className="btn btn-success"  disabled={!isDirty} type="submit">
                Update
              </button>
              {isLoading &&
                <span className="fa fa-circle-o-notch fa-spin" />
              }
            </div>

            <div className="form-group col-md-1 pull-right">
              <button className="btn btn-secondary" disabled={!isDirty} onClick={ () => handleResetEditCategory() } >
                Reset
              </button>
              {isLoading &&
                <span className="fa fa-circle-o-notch fa-spin" />
              }
            </div>
          </form>

          <div className="form-group col-md-1 pull-right">
              {
              <CancelButton prompt={isDirty} message={cancelEditCategoryMessage()} onClick={() => handleCancelEditCategory()} className="btn btn-danger">Cancel</CancelButton>
              }
           </div>

        </div>
      )
    }
  </div>
  )
}

export default EditCategory;