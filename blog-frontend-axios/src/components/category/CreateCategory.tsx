import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup';
import CancelButton from '../common/cancelConfirmation'
import { yupResolver } from '@hookform/resolvers/yup';
import { CategoryApiService } from "../../services/api/CategoryApiService";
import { createActionLoading } from '../../reducers/auth';
import useAuth from '../../contexts/auth';
import ListErrors from '../common/ListErrors';
import { IErrors, minimumCategoryTitleLength, minimumCategoryDescriptionLength } from '../../types';
import { checkUnauthorized, checkSessionExpired, checkTimeout } from '../../utils/html.response.utils';
import { createActionSessionExpired } from '../../reducers/auth';

const CreateCategory = () => {

  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Category title is required')
      .min(minimumCategoryTitleLength, `Category title must be at least ${minimumCategoryTitleLength} characters long`),
    description: Yup.string().required('Description is required')
      .min(minimumCategoryDescriptionLength, `Description must be at least ${minimumCategoryDescriptionLength} characters long`),
  });

  type CreateSubmitForm = {
    title: string;
    description: string;
  };

  const defaultValues = {title: '', description: ''};

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateSubmitForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  const onSubmit = async (data: CreateSubmitForm) => {
    if (submitForm) {
      dispatch(createActionLoading(true));
      await CategoryApiService.createCategory(data)
      .then(() => { handleSubmitFormSucess(); })
      .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); })
      .finally(() => dispatch(createActionLoading(false)));
    }
  } 

  const handleSubmitForm = () => {
    setSubmitForm(true);
  }

  const handleSubmitFormSucess = () => {
    toast.success(`Category created successfully...`);
    navigate('/category');
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

  const handleSubmitFormError = (apiErrors: IErrors) => {
    handleApiErrors(apiErrors,'Category creation');
  }

  const cancelCreateCategoryMessage = () => `Category creation and loose changes`;

  const handleClearCreateCategory = () => {
    reset(defaultValues, { keepDirty: false});
  }

  const handleCancelCreateCategory = () => {
    navigate('/category');   
  };

  return (
    <div>
    <div className={"col-md-12 form-wrapper"}>
      <h2> Create Category </h2>
      {errorList && <ListErrors errors={errorList} />}
      <form id={"create-category-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
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
              <CancelButton prompt={isDirty} message={cancelCreateCategoryMessage()} onClick={() => handleCancelCreateCategory()} className="btn ml-2 btn-danger">Cancel</CancelButton>
              <button className="btn ml-2 btn-secondary" disabled={!isDirty} onClick={() => handleClearCreateCategory()} >
                Clear
              </button>
              <button className="btn ml-2 btn-success"  disabled={!isDirty} onClick={ () => handleSubmitForm()}>
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  );

}
export default CreateCategory
