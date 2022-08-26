export interface IFilterFindContainsCriterias {
    property: string;
    value: string;
}
export interface IFilterFindExistCriterias {
    property: string;
    exist: boolean;
}
export declare class FilterFindCriterias {
    contains?: IFilterFindContainsCriterias;
    exist?: IFilterFindExistCriterias;
}
