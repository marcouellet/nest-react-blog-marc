import { IFilterFindContainsCriterias, IFilterFindExistCriterias, FilterFindCriterias } from '../../../core/find-criterias/filter.find-criterias';

function buildMongoFindFilterCriterias(criterias: {}): {} {
    let filter = {};
    let filterCriterias: any = { ...criterias };
    if (filterCriterias.contains) {
        const containsCriteria: IFilterFindContainsCriterias = filterCriterias.contains;
        filter[containsCriteria.property] = { "$regex": containsCriteria.value, "$options": "i" }
    } 
    if (filterCriterias.exist) {
        const existCriteria: IFilterFindExistCriterias = filterCriterias.exist;
        filter[existCriteria.property] = { "$exists": existCriteria.exist }
    }
    return filter;
}

function buildMongoRemoveFindFilterCriterias(criterias: {}): {} {

    let filterCriterias: any = { ...criterias };
    delete filterCriterias.contains;
    delete filterCriterias.exist;

    return filterCriterias;
}

export function buildMongoFindCriterias(criterias: {}) {
    const findFilterCriterias = buildMongoFindFilterCriterias(criterias);
    const otherCriterias = buildMongoRemoveFindFilterCriterias(criterias);

    let filter = {...findFilterCriterias, ...otherCriterias};

    return filter;
  }
