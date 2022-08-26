import { CategoryDto, UpdateCategoryDto } from '@blog-common/dtos';
import { CategoryFindCriterias } from '@blog-common/find-criterias';

export const testE2ENonExistingCategoryId_Category = 'twelvelong12'; // required by MongoDB
export const testE2ENonExistingCategoryTitle_Category = 'non existing title';
export const testE2ECategoryTitle_Category = 'e2e.category.title';
export const testE2ECategoryUpdatedTitle_Category = 'e2e.category.updated.title';
export const testE2EDummyUserEmail_Category = 'e2e.category.dummy@email.com';
export const testE2EAdminUserEmail_Category = 'e2e.category.admin@email.com';
export const testE2EDummyUserPassword_Category = 'e2e.category.dummy.password';
export const testE2EAdminUserPassword_Category = 'e2e.category.admin.password';
export const testE2EDummyUserName_Category = 'e2e.category.dummy.name';
export const testE2EAdminUserName_Category = 'e2e.category.admin.name';

export const testE2EFindCategoryNonExistingTitleCriteriasCount_Category = 1;
export const testE2EFindCategoryNonExistingTitleCriterias_Category: CategoryFindCriterias = { title: testE2ENonExistingCategoryTitle_Category };
export const testE2EFindUpdatedCategoryTitleCriterias_Category: CategoryFindCriterias = { title: testE2ECategoryUpdatedTitle_Category };

export const testE2ERegisterDummyUser_Category = {
  username: testE2EDummyUserName_Category,
  email: testE2EDummyUserEmail_Category,
  password: testE2EDummyUserPassword_Category,
};

export const testE2ERegisterAdminUser_Category = {
  username: testE2EAdminUserName_Category,
  email: testE2EAdminUserEmail_Category,
  password: testE2EAdminUserPassword_Category,
};

export const testE2ELoginDummyUser_Category = {
  email: testE2EDummyUserEmail_Category,
  password: testE2EDummyUserPassword_Category,
};

export const testE2ECreateCategoryDto_Category: CategoryDto = {
    title: testE2ECategoryTitle_Category,
    description: 'description',
  };

  export const testE2EUpdateCategoryTitleDto_Category: UpdateCategoryDto = {
    title: testE2ECategoryUpdatedTitle_Category,
    description: 'updated description',
  };