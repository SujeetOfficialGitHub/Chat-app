const Sequelize = require('sequelize');

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const host = process.env.HOST;

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host : host,
    dialect: 'mysql'
});

(async() => {
    try{
        await sequelize.authenticate();
        console.log('db connected')
    }catch(error){
        console.log('db failed to connect')
        console.log(error)
    }
})();

module.exports = sequelize;