import { ICategory } from '../types';

export enum UIActionType {
  SetCategoryFilter = 'SET_CATEGORY_FILTER',
  SetPostTitleFilter = 'SET_POST_TITLE_FILTER',
  SetUserNameFilter = 'SET_USER_NAME_FILTER',
}

export const createActionSetCategoryFilter = (category: ICategory) : UIAction => { return {type:  UIActionType.SetCategoryFilter, categoryFilter: category}}
export const createActionSetPostTitleFilter = (titleFilter: string) : UIAction => { return {type:  UIActionType.SetPostTitleFilter, postTitleFilter: titleFilter}}
export const createActionSetUserNameFilter = (userName: string) : UIAction => { return {type:  UIActionType.SetUserNameFilter, userNameFilter: userName}}

export type UIAction =
| { 
    type: UIActionType.SetCategoryFilter;
    categoryFilter: ICategory;
  }
| { 
    type: UIActionType.SetPostTitleFilter;
    postTitleFilter: string;
  }
| { 
    type: UIActionType.SetUserNameFilter;
    userNameFilter: string;
  }
;
export interface UIState {
  categoryFilter: ICategory | undefined,
  postTitleFilter: string,
  userNameFilter: string,
}

export const initialState: UIState = {
  categoryFilter: undefined,
  postTitleFilter: '',
  userNameFilter: ''
};

export function UIReducer(state: UIState, action: UIAction):UIState {
  switch (action.type) {
    case UIActionType.SetCategoryFilter: {
      return { ...state, categoryFilter: action.categoryFilter};
    }
    case UIActionType.SetPostTitleFilter: {
      return { ...state, postTitleFilter: action.postTitleFilter};
    }    
    case UIActionType.SetUserNameFilter: {
      return { ...state, userNameFilter: action.userNameFilter};
    }     
    default:
      return state;
  }
}
