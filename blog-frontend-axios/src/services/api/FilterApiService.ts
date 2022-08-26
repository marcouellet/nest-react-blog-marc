import { IFilterFindContainsCriterias, IFilterFindCriterias }  from '@Types';

export function buildPostTitleFilter(postTitleFilter: string) {
    let filter: any = {};
    if (postTitleFilter) {
        const containsFilter: IFilterFindContainsCriterias = {property: 'title', value: postTitleFilter}
        const titleFilter: IFilterFindCriterias = {contains: containsFilter}
        filter = titleFilter;
    }
    return filter;
}

export function buildUserNameFilter(userNameFilter: string) {
    let filter: any = {};
    if (userNameFilter) {
        const containsFilter: IFilterFindContainsCriterias = {property: 'username', value: userNameFilter}
        const nameFilter: IFilterFindCriterias = {contains: containsFilter}
        filter = nameFilter;
    }
    return filter;
}
