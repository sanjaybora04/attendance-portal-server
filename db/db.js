const { Sequelize, Model, DataTypes } = require("sequelize");
const pg = require('pg');

const connect = () => {

    const hostName = 'localhost';
    const userName = "postgres";
    const password = 'postgres';
    const database = 'attendance_portal';
    const dialect = 'postgres';

    // const sequelize = new Sequelize(database, userName, password, {
    //     host: hostName,
    //     dialect: dialect,
    //     operatorsAliases: false,
    //     pool: {
    //         max: 10,
    //         min: 0,
    //         acquire: 20000,
    //         idle: 5000
    //     }
    // });

    // console.log('process.env.PG_CONNECTION_STR ', process.env.PG_CONNECTION_STR)

    const sequelize = new Sequelize(process.env.PG_CONNECTION_STR, {
        dialectModule: pg
    });

    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    db.user = require("./models/usermodel")(sequelize, DataTypes, Model);
    db.class = require("./models/classmodel")(sequelize,DataTypes,Model);
    db.attendance = require("./models/attendancemodel")(sequelize,DataTypes,Model);


    // Relationships
    db.user.hasMany(db.class,{as:"MyClasses",onDelete:'Cascade',foreignKey:{name:"classId",allowNull:false}})
    db.class.belongsTo(db.user,{as:"Teacher",foreignKey:{name:"teacherId"}})

    db.user.belongsToMany(db.class,{through:'studentclasses',as:'Classes'})
    db.class.belongsToMany(db.user,{through:'studentclasses',as:'Students'})

    db.user.belongsToMany(db.attendance,{through:'userattendance',as:'Attendances'})
    db.attendance.belongsToMany(db.user,{through:'userattendance',as:'Students'})

    db.class.hasMany(db.attendance,{as:'Attendances',onDelete:'Cascade'})
    db.attendance.belongsTo(db.class,{as:'Class'})


    return db;

}

module.exports = {
    connect
}