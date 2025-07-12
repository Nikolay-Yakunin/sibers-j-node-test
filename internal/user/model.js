const { Model, DataTypes } = require('sequelize');

class UserModel extends Model { }

// DB instance - sequelize
function initUserModel(sequelize) {
  UserModel.init(
    {
      username: {
        type: DataTypes.STRING(39),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 39],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Hashed password',
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
        },
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
        },
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: true, // for first_name and last_name 
    }
  );

  return UserModel
}

module.exports = initUserModel;
