const createError = require('http-errors');
const { UserService } = require('./service')


class UserHandler {
  constructor(userService) {
    this.service = userService;
  }

  // GET /users?page=1&field='username'&sort='ASC'&gender='male'
  async getUsers({ query = {} }) {
    const { page = 1, sortby = 'username', sort = 'ASC', search = '' } = query;
    return await this.service.getUsers({ page, sortby, sort, search });
  }

  // GET /users?id=1
  async getUser({ params = {} }) {
    const { id } = params;
    if (!id) {
      throw createError(400, 'id is required');
    }
    return await this.service.getUserById(Number(id));
  }

  // POST /users
  async postUser(body = {}) {
    const {
      username,
      password,
      first_name,
      last_name,
      gender,
      birthdate
    } = body;

    // check all fields
    const user = { username, password, first_name, last_name, gender, birthdate }
    const missing = Object
      .entries(user)
      .filter(([_, v]) => v === undefined || v === '')
      .map(([k]) => k);
    if (missing.length) {
      throw createError(400, `Required fields are missing: ${missing.join(', ')}`);
    }

    return this.service.createUser({
      username,
      password,
      first_name,
      last_name,
      gender,
      birthdate
    })
  }

  // PUT /users 
  async updateUser(body = {}) {
    const {
      username,
      password,
      first_name,
      last_name,
      gender,
      birthdate
    } = body;

    // fields can be undefined

    return this.service.updateUser({
      username,
      password,
      first_name,
      last_name,
      gender,
      birthdate
    })
  }

  // DELETE /users/:id
  async deleteUser({ params = {} }) {
    const { id } = params;
    if (!id) {
      throw createError(400, 'id is required');
    }
    return await this.service.deleteUser(id);
  }

}

function NewUserHandler(userService) {
  if (!(userService instanceof UserService)) {
    throw new TypeError('Invalid type: expected instance of UserService');
  }

  return new UserHandler(userService)
}

module.exports = { UserHandler, NewUserHandler }