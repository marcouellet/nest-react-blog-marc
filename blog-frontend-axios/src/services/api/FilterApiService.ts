import { IFilterFindContainsCriterias, IFilterFindCriterias }  from '../../types';

export function buildPostTitleFilter(postTitleFilter: string) {
    let filter: any = {};
    if (postTitleFilter) {
        const containsFilter: IFilterFindContainsCriterias = {property: 'title', value: postTitleFilter}
        const titleFilter: IFilterFindCriterias = {contains: containsFilter}
        filter = titleFilter;
    }
    return filter;
}
