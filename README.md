# sequelize-models-collector

## FEATURES

* Allow to set association within file of model declaration
* Allow to import any models directly from models directory

## Installing

    $ npm i --save sequelize-models-collector

## Usage

### Assume import in index.js in models directory

    module.exports = require('seuelize-models-collector')(Sequelize, sequelize, dirname[, cofig]);

arguments:

    1. Sequelize function
    2. Sequlize instance
    3. Path to models directory
    4. config (optional, by default {})

### Model and relations declaration example

    module.exports = function(Sequelize, sequelize) {
        const User = sequelize.define('User', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            name: Sequelize.STRING,
            email: Sequelize.STRING
        },
            {
            tableName: 'user'
            });
        User.relate = function (models) {
            models.User.hasMany(models.Order);
            models.User.hasMany(models.Product);
            models.User.hasOne(models.Cart);
        };

        return User;
    };