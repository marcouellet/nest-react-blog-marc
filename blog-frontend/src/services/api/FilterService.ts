import { IFilterFindContainsCriterias, FilterFindCriterias } from "shared/find-criterias";

function buildPostTitleFilter(postTitleFilter: string) {
    let filter: any = {};
    if (postTitleFilter) {
        const containsFilter: IFilterFindContainsCriterias = {property: 'title', value: postTitleFilter}
        const titleFilter: FilterFindCriterias = {contains: containsFilter}
        filter = titleFilter;
    }
    return filter;
}

function buildUserNameFilter(userNameFilter: string) {
    let filter: any = {};
    if (userNameFilter) {
        const containsFilter: IFilterFindContainsCriterias = {property: 'username', value: userNameFilter}
        const nameFilter: FilterFindCriterias = {contains: containsFilter}
        filter = nameFilter;
    }
    return filter;
}

export const FilterService = { buildPostTitleFilter, buildUserNameFilter }
