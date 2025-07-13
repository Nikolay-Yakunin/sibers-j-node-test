/**
 * Class BaseRepository
 * 
 * Implemets CRUD 
 */
class BaseRepository {
  constructor(model) {
    // I don't think this class needs a generator.
    this.model = model
  }

  async create(data) {
    const created = await this.model.create(data);
    return created.toJSON();
  }

  async findById(id) {
    const record = await this.model.findByPk(id);
    return record ? record.toJSON() : null;
  }

  /**
   * Return all with pagination
   * 
   * where: {
   *  username: 'nick',
   *  gender: 'male'
   * }
   * @param {Object} [options]
   * @param {number} [options.limit] how much
   * @param {number} [options.offset] start
   * @param {Object} [options.where] filters, usaly like WHERE in sql 
   * 
   * @returns {Promise<{ rows: Object[], count: number }>}
   */
  async findAll(options = {}) {
    const { limit, offset, where } = options;

    const result = await this.model.findAndCountAll({
      where,
      limit,
      offset,
    });

    return {
      count: result.count,
      rows: result.rows.map(r => r.toJSON()),
    };
  }

  async update(id, updates) {
    const [count] = await this.model.update(updates, {
      where: { id },
    });

    if (count === 0) {
      throw new Error(`Record with ID=${id} not found or field not exist`);
    }

    // returning: true
    //  are not allowerd sqlite and more
    return await this.findById(id);
  }

  async delete(id) {
    const count = await this.model.destroy({
      where: { id },
    });

    if (count === 0) {
      throw new Error(`Record with ID=${id} not found`);
    }
  }
}

module.exports = { BaseRepository };