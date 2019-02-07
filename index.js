'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(Sequelize, sequelize, dirname, config = {} ) {
    if (typeof Sequelize !== 'function' || typeof sequelize !== 'object' || typeof dirname !== 'string') {
        throw new Error('Invalid argument. First argument must be Sequelize. Second argument must be instance of Sequelize. Third argument must be path to models directory');
    }
    const models = {};

    // set model as property of models object
    function createModel(filePath) {
        const modelSource = require(filePath);
        if (typeof modelSource === 'function' ) {
            const model = modelSource(Sequelize, sequelize, config);
            models[model.name.slice(0,1).toLocaleUpperCase() + model.name.slice(1)] = model;
        }
    }

    // go through models directory and gather models into one object
    function combineModels(dir) {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                return(combineModels(filePath));
            } else if (file !== 'index.js' && file.slice(-3) === '.js') {
                createModel(filePath);
            }
        });
    }

    try {
        combineModels(dirname);

        // set association
        for ( let model in models){
            if (models[model].relate) {
                models[model].relate(models);
            }
        }
    } catch(error) {
        throw error
    }

    return models;
};
