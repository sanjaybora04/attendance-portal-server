module.exports = (sequelize, DataTypes, Model) => {

  class Users extends Model { }

  Users.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    profilePicture: {
      type: DataTypes.TEXT
      // allowNull defaults to true
    },
    defaultMode:{
      type: DataTypes.STRING,
      defaultValue:"student",
      allowNull:false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'users' // We need to choose the model name
  });

  return Users;
}