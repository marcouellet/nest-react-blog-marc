import { CategoryDto } from "shared/dtos";

export enum UIActionType {
  Loading = 'LOADING',
  SetCategoryFilter = 'SET_CATEGORY_FILTER',
  SetPostTitleFilter = 'SET_POST_TITLE_FILTER',
  SetUserNameFilter = 'SET_USER_NAME_FILTER',
}

export const createActionLoading = (isLoading: boolean) : UIAction => { return {type:  UIActionType.Loading, isLoading: isLoading}}
export const createActionSetCategoryFilter = (category: CategoryDto) : UIAction => { return {type:  UIActionType.SetCategoryFilter, categoryFilter: category}}
export const createActionSetPostTitleFilter = (titleFilter: string) : UIAction => { return {type:  UIActionType.SetPostTitleFilter, postTitleFilter: titleFilter}}
export const createActionSetUserNameFilter = (userName: string) : UIAction => { return {type:  UIActionType.SetUserNameFilter, userNameFilter: userName}}

export type UIAction =
| { 
    type: UIActionType.Loading;
    isLoading: boolean;
  }
| { 
    type: UIActionType.SetCategoryFilter;
    categoryFilter: CategoryDto;
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
  isLoading: boolean,
  lastActivityTimeStamp: Date | undefined,
  categoryFilter: CategoryDto | undefined,
  postTitleFilter: string,
  userNameFilter: string,
}

export const initialUIState: UIState = {
  isLoading: false,
  lastActivityTimeStamp: undefined,
  categoryFilter: undefined,
  postTitleFilter: '',
  userNameFilter: ''
};

export function UIReducer(state: UIState, action: UIAction):UIState {
  switch (action.type) {
    case UIActionType.Loading: {
      return { ...state, isLoading: action.isLoading!, lastActivityTimeStamp: new Date()};
    }
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
