import type { Table } from 'dexie';

export abstract class BaseCrudService<T> {
  protected table: Table<T>;

  constructor(table: Table<T>) {
    this.table = table;
  }

  /**
   * Create a new entity
   */
  async create(data: T): Promise<T> {
    const id = await this.table.add(data);
    const created = await this.table.get(id);
    if (!created) {
      throw new Error('Failed to create entity');
    }
    return created;
  }

  /**
   * Create multiple entities
   */
  async createMany(data: T[]): Promise<T[]> {
    const ids = await this.table.bulkAdd(data, { allKeys: true });
    const created = await Promise.all(ids.map((id) => this.table.get(id)));
    return created.filter((item) => item !== undefined) as T[];
  }

  /**
   * Get entity by ID
   */
  async getById(id: string | number): Promise<T | undefined> {
    return await this.table.get(id);
  }

  /**
   * Get all entities
   */
  async getAll(): Promise<T[]> {
    return await this.table.toArray();
  }

  /**
   * Get entities with pagination
   */
  async getPaginated(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const total = await this.table.count();
    const totalPages = Math.ceil(total / pageSize);
    const offset = (page - 1) * pageSize;

    const data = await this.table.offset(offset).limit(pageSize).toArray();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Update entity by ID
   */
  async update(id: string | number, data: Partial<T>): Promise<T> {
    const updated = await this.table.update(id, data);
    if (updated === 0) {
      throw new Error('Entity not found');
    }
    const entity = await this.table.get(id);
    if (!entity) {
      throw new Error('Failed to retrieve updated entity');
    }
    return entity;
  }

  /**
   * Delete entity by ID
   */
  async delete(id: string | number): Promise<void> {
    await this.table.delete(id);
  }

  /**
   * Delete multiple entities by IDs
   */
  async deleteMany(ids: (string | number)[]): Promise<void> {
    await this.table.bulkDelete(ids);
  }

  /**
   * Count all entities
   */
  async count(): Promise<number> {
    return await this.table.count();
  }

  /**
   * Check if entity exists
   */
  async exists(id: string | number): Promise<boolean> {
    const entity = await this.table.get(id);
    return entity !== undefined;
  }

  /**
   * Clear all entities
   */
  async clear(): Promise<void> {
    await this.table.clear();
  }
}
