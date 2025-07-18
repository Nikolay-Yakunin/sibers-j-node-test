const { User, NewUser } = require('./user')
const { UserRepository } = require('./repository')
const bcrypt = require("bcrypt")
/**
 * Class 
 */
class UserService {
  constructor(userRepository) {
    this.repo = userRepository;
    this.LIMIT = 10; // for pagination 
  }

  /**
   * Get all users with pagination, sorting and filters
   * @param {Object} params
   * @param {number} [params.page=1] by default start on 1
   * @param {string} [params.sortby] sort field
   * @param {'ASC'|'DESC'} [params.sort='ASC'] sort order
   * @param {Object} [params.filters] example { gender: 'male' }
   * @returns {Promise<{count: number, rows: Object[]}>}
   */
  async getUsers(params = {}) {
    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const limit = this.LIMIT;
    const offset = (page - 1) * limit;

    // This is clearly not the service's responsibility. SRP is broken :(
    const orderField = params.sortby || 'id';
    const orderDirection = (params.sort && ['ASC', 'DESC'].includes(params.sort.toUpperCase()))
      ? params.sort.toUpperCase()
      : 'ASC';

    const search = params.search; // that maybe owerhead, but i want add this

    return await this.repo.findAllUsers({
      limit,
      offset,
      order: [[orderField, orderDirection]],
      search,
    });
  }

  async getUserById(userId) {
    // I dont know
    // Is it necessary to add more the same argument checks 
    // if they are already checked further?
    if (!userId) throw new Error('userId is required');
    return await this.repo.findUserById(userId);
  }

  async createUser(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new TypeError('Invalid userData');
    }

    const user = NewUser(
      userData.username,
      userData.password,
      userData.first_name,
      userData.last_name,
      userData.gender,
      userData.birthdate
    );

    // I need to move this to a separete pkq?   
    const passwordHash = await bcrypt.hash(user.getPassword(), 10);

    return await this.repo.createUser(user, passwordHash);
  }

  async updateUser(userId, updateData) {
    if (!userId) throw new Error('userId is required');
    // if (!updateData || typeof updateData !== 'object') {
    //   throw new TypeError('Invalid updateData');
    // }

    const existing = await this.repo.findUserById(userId);
    if (!existing) throw new Error(`User with ID=${userId} not found`);

    const user = new User(existing);

    if ('username' in updateData) user.setUserName(updateData.username);
    if ('first_name' in updateData) user.setFirstName(updateData.first_name);
    if ('last_name' in updateData) user.setLastName(updateData.last_name);
    if ('gender' in updateData) user.setGender(updateData.gender);
    if ('birthdate' in updateData) user.setBirthdate(updateData.birthdate);

    let passwordHash = undefined; // for sequelize
    if ('password' in updateData) {
      const rawPassword = updateData.password;
      user.setPassword(rawPassword);
      passwordHash = await bcrypt.hash(rawPassword, 10);
    }

    return await this.repo.updateUser(userId, user, passwordHash);
  }

  async deleteUser(userId) {
    if (!userId) throw new Error('userId is required');
    return await this.repo.deleteUser(userId)
  }
}

function NewUserService(userRepository) {
  if (!(userRepository instanceof UserRepository)) {
    throw new TypeError('Invalid type: expected instance of UserRepository');
  }

  return new UserService(userRepository);
}

module.exports = { UserService, NewUserService }