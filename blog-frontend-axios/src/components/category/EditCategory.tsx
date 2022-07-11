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
import { checkUnauthorized, checkSessionExpired, checkTimeout } from '../../utils/html.response.utils';
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

  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkSessionExpired(apiErrors)) {
      toast.error(`${process} failed, session expired`);
      dispatch(createActionSessionExpired());
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else if (checkTimeout(apiErrors)) {
      toast.error(`Request timeout`);
    } else {
      toast.error(`${process} failed, see error list`);
      setErrorList(apiErrors);      
    }
  }

  const handleFetchCategoryError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors, 'Category reading');
  }

  const handleSubmitFormSucess = () => {
    toast.success(`Category updated successfully...`);
    navigate(`/category/${category?.id}`)
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors, 'Category update');
}

const cancelEditCategoryMessage = () => `category edition and loose changes`;

const handleResetEditCategory = () => {
  reset(defaultValues, { keepDirty: false});
}

const handleCancelEditCategory = () => {
  navigate(`/category/${category?.id}`)
};

  return (
    <div className={'page-wrapper'}>
    {category &&
      (
        <div className={"col-md-12 form-wrapper"}>
          <h2> Edit Category </h2>
          {errorList && <ListErrors errors={errorList} />}
          <form id={"edit-category-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
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
              <label htmlFor="description"> Description </label>
              <input 
                type="text" 
                placeholder="Enter description"
                {...register('description')}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
              />
              <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
            <div className="row">
              <div className="col-lg-10 col-md-12">
                <div className="form-group row-md-5 pull-right">
                  <CancelButton prompt={isDirty} message={cancelEditCategoryMessage()} onClick={() => handleCancelEditCategory()} className="btn ml-2 btn-danger">Cancel</CancelButton>
                  <button className="btn ml-2 btn-secondary" disabled={!isDirty} onClick={() => handleResetEditCategory()} >
                    Reset
                  </button>
                  {isLoading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
                  <button className="btn ml-2 btn-success"  disabled={!isDirty} type="submit">
                    Update
                  </button>
                  {isLoading &&
                    <span className="fa fa-circle-o-notch fa-spin" />
                  }
                </div>
              </div>
            </div>
          </form> 
        </div>
      )
    }
    </div>
  )
}

export default EditCategory;