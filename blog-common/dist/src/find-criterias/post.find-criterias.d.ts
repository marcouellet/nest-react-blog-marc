import { UserFindCriterias } from './user.find-criterias';
export declare class PostFindCriterias {
    title?: string | {};
    description?: string;
    userCriterias?: UserFindCriterias;
    publishedBefore?: Date;
    publishedAfter?: Date;
}
