export interface IFilterFindContainsCriterias {
    property: string;
    value: string;
}

export interface IFilterFindExistCriterias {
    property: string;
    exist: boolean;
}

export class FilterFindCriterias {
  contains?: IFilterFindContainsCriterias;
  exist?: IFilterFindExistCriterias;
}
