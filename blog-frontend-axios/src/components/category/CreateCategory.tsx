import React from 'react';
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
import { checkUnauthorized, checkForbidden } from '../../utils/response';
import { createActionSessionExpired } from '../../reducers/auth';

const CreateCategory = () => {

  const navigate = useNavigate();
  const { state: { isLoading }, dispatch } = useAuth();
  const [errorList, setErrorList] = React.useState<IErrors | null>();

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
    dispatch(createActionLoading(true));
    await CategoryApiService.createCategory(data)
    .then(() => { handleSubmitFormSucess(); })
    .catch((apiErrors: IErrors) =>  { handleSubmitFormError(apiErrors); });
    dispatch(createActionLoading(false));
  } 

  const handleSubmitFormSucess = () => {
    toast.success(`Category created successfully...`);
    navigate('/category');
  }

  const handleSubmitFormError = (apiErrors: IErrors) => {
    if (checkForbidden(apiErrors)) {
      toast.error(`Category creation failed, session expired`);
      dispatch(createActionSessionExpired());
    } else if (checkUnauthorized(apiErrors)) {
      toast.error(`Category already exist or access denied`);
    } else {
      toast.error(`Category creation failed, see error list`);
      setErrorList(apiErrors);      
    }
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
      <form id={"create-Category-form"} onSubmit={handleSubmit(onSubmit)} noValidate={true}>
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

            <div className="form-group col-md-4 pull-right">
              <button className="btn btn-success"  disabled={!isDirty} type="submit">
                Create
              </button>
              {isLoading &&
                <span className="fa fa-circle-o-notch fa-spin" />
              }
            </div>

            <div className="form-group col-md-1 pull-right">
              <button className="btn btn-secondary" disabled={!isDirty} onClick={ () => handleClearCreateCategory() } >
                Reset
              </button>
              {isLoading &&
                <span className="fa fa-circle-o-notch fa-spin" />
              }
            </div>

      </form>

      <div className="form-group col-md-1 pull-right">
              <CancelButton prompt={isDirty} message={cancelCreateCategoryMessage()} onClick={() => handleCancelCreateCategory()} className="btn btn-danger">Cancel</CancelButton>
            </div>

    </div>
  </div>
  );

}
export default CreateCategory
