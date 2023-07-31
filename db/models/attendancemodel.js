module.exports = (sequelize, DataTypes, Model) => {

    class Attendance extends Model {}

    Attendance.init({
        // Model attributes are defined here
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'attendance' // We need to choose the model name
      });
      
      return Attendance;
}