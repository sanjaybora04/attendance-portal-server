module.exports = (sequelize, DataTypes, Model) => {

    class Class extends Model {}

    Class.init({
        // Model attributes are defined here
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'class' // We need to choose the model name
      });
      
      return Class;
}