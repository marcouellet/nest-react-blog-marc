import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { CancelButton, ListErrors } from '@Common';
import { ICategory, IUpdateCategory, createCategoryForUpdate, minimumCategoryTitleLength, 
          minimumCategoryDescriptionLength, IErrors } from "@Types";
import { CategoryApiService } from '@Services';
import { createActionSessionExpired, createActionLoading } from '@Reducers';
import { useUIContext, useSessionContext } from '@Contexts';
import { checkUnauthorized, checkSessionExpired, checkTimeout } from '@Utils';

const EditCategory = () => {

  const navigate = useNavigate();
  const { dispatchSession } = useSessionContext();
  const { dispatchUI } = useUIContext();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<ICategory>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
 
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
      .min(minimumCategoryTitleLength, `Title must be at least ${minimumCategoryTitleLength} characters long`),
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
    (async () => {
      // alert('EditCategory useEffet called');
      const fetchData = async (): Promise<void> => {
        dispatchUI(createActionLoading(true));
        await CategoryApiService.getCategoryById(categoryId!)
        .then((category) => { setCategory(category); reset(category);})
        .catch((apiErrors: IErrors) => handleApiErrors(apiErrors, 'Category reading'))
        }
      await fetchData();
    })().finally(() => dispatchUI(createActionLoading(false)));      
  // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: UpdateSubmitForm) => {
    if (category && isDirty && submitForm) {
      dispatchUI(createActionLoading(true));
      const userData: IUpdateCategory = createCategoryForUpdate({...category, ...data});
      await CategoryApiService.updateCategory(category.id!, userData)
      .then(() => { handleSubmitFormSuccess(); })
      .catch((apiErrors: IErrors) =>  { handleApiErrors(apiErrors, 'Category update'); })
      .finally(() => dispatchUI(createActionLoading(false)));
     }
  } 

  const handleApiErrors = (apiErrors: IErrors, process: string) => {
    if (checkSessionExpired(apiErrors)) {
      toast.error(`${process} failed, session expired`);
      dispatchSession(createActionSessionExpired());
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Access denied`);
    } else if (checkTimeout(apiErrors)) {
      toast.error(`Request timeout`);
    } else {
      toast.error(`${process} failed, see error list`);
      setErrorList(apiErrors);      
    }
  }

  const handleSubmitForm = () => {
    setSubmitForm(true);
  }

  const handleSubmitFormSuccess = () => {
    toast.success(`Category updated successfully...`);
    navigate(`/category/${category?.id}`)
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
                  <button className="btn ml-2 btn-success"  disabled={!isDirty} onClick={ () => handleSubmitForm()}>
                    Update
                  </button>
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