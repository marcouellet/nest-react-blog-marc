const {aliasDangerous, configPaths} = require('react-app-rewire-alias/lib/aliasDangerous')

module.exports = function override(config) {
    return aliasDangerous(configPaths('tsconfig.paths.json'))(config);
}
