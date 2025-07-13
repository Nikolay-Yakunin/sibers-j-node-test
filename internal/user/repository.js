const { BaseRepository } = require("../../pkg/database");
const initUserModel = require("./model");
const User = require("./user");


class UserRepository extends BaseRepository {
  async createUser(user) {
    if (!(user instanceof User)) {
      throw new TypeError("Invalid type: user must be User");
    }

    return await this.create(this.toDto(user));
  }

  // decomposition
  toDto(user) {
  return {
    username: user.getUserName(),
    password: user.getPassword(),
    first_name: user.getFirstName(),
    last_name: user.getLastName(),
    gender: user.getGender(),
    birthdate: user.getBirthdate()
  };
}
}

function NewUserRepository(sequelize) {
  return new UserRepository(initUserModel(sequelize))
}

module.exports = NewUserRepository;