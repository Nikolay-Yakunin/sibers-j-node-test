/**
 * Class BaseRepository
 * 
 * Implemets CRUD 
 */
class BaseRepository {
  constructor(model) {
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
    const { limit, offset, where, include } = options;

    const result = await this.model.findAndCountAll({
      where,
      include,
      limit,
      offset,
    });

    return {
      count: result.count,
      rows: result.rows.map(r => r.toJSON()),
    };
  }

  async update(id, updates) {
    const [count, [updated]] = await this.model.update(updates, {
      where: { id },
      returning: true,
    });

    if (count === 0) {
      throw new Error(`Record with ID=${id} not found`);
    }

    return updated.toJSON();
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