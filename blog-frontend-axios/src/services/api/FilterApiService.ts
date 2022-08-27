import { IFilterFindContainsCriterias, FilterFindCriterias } from "@blog-common/find-criterias";

export function buildPostTitleFilter(postTitleFilter: string) {
    let filter: any = {};
    if (postTitleFilter) {
        const containsFilter: IFilterFindContainsCriterias = {property: 'title', value: postTitleFilter}
        const titleFilter: FilterFindCriterias = {contains: containsFilter}
        filter = titleFilter;
    }
    return filter;
}

export function buildUserNameFilter(userNameFilter: string) {
    let filter: any = {};
    if (userNameFilter) {
        const containsFilter: IFilterFindContainsCriterias = {property: 'username', value: userNameFilter}
        const nameFilter: FilterFindCriterias = {contains: containsFilter}
        filter = nameFilter;
    }
    return filter;
}
