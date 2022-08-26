"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimumCategoryDescriptionLength = exports.minimumCategoryTitleLength = exports.minimumPostBodyLength = exports.minimumPostDescriptionLength = exports.minimumPostTitleLength = exports.minimumUserNameLength = exports.minimumEmailLength = exports.minimumPasswordLength = exports.createCategoryForUpdate = exports.createPostForUpdate = exports.createUserForUpdate = exports.IAuthToken = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
class IAuthToken {
}
exports.IAuthToken = IAuthToken;
function createUserForUpdate(user) {
    const updateUser = { username: user.username, email: user.email, password: user.password,
        role: user.role, image: user.image };
    if (!updateUser.password) {
        delete updateUser.password;
    }
    return updateUser;
}
exports.createUserForUpdate = createUserForUpdate;
function createPostForUpdate(post) {
    const updatePost = { category: post.category, title: post.title, description: post.description, body: post.body,
        image: post.image };
    return updatePost;
}
exports.createPostForUpdate = createPostForUpdate;
function createCategoryForUpdate(category) {
    const updateCategory = { title: category.title, description: category.description };
    return updateCategory;
}
exports.createCategoryForUpdate = createCategoryForUpdate;
exports.minimumPasswordLength = 3;
exports.minimumEmailLength = 10;
exports.minimumUserNameLength = 2;
exports.minimumPostTitleLength = 3;
exports.minimumPostDescriptionLength = 10;
exports.minimumPostBodyLength = 10;
exports.minimumCategoryTitleLength = 3;
exports.minimumCategoryDescriptionLength = 10;
//# sourceMappingURL=index.js.map