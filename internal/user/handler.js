const createError = require('http-errors');
const { UserService } = require('./service')


class UserHandler {
  constructor(userService) {
    this.service = userService;
  }

  // GET /users
  async getUsers({ query = {} }) {
    const { page = 1, sortby = 'username', sort = 'ASC', search = '' } = query;
    return this.service.getUsers({ page, sortby, sort, search });
  }

  // GET /users/:id
  async getUser({ params = {} }) {
    const { id } = params;
    if (!id) {
      throw createError(400, 'id is required');
    }
    return this.service.getUserById(Number(id));
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

  // PUT /users/:id
  async updateUser({ params = {}, body = {} }) {
    const { id } = params;
    if (!id) {
      throw createError(400, 'id is required');
    }
    return this.service.updateUser(Number(id), body);
  }

  // DELETE /users/:id
  async deleteUser({ params = {} }) {
    const { id } = params;
    if (!id) {
      throw createError(400, 'id is required');
    }
    return await this.service.deleteUser(Number(id));
  }

}

function NewUserHandler(userService) {
  if (!(userService instanceof UserService)) {
    throw new TypeError('Invalid type: expected instance of UserService');
  }

  return new UserHandler(userService)
}

module.exports = { UserHandler, NewUserHandler }