import { BaseCrudService } from './base.crud.service';
import db from '@/services/database.service';
import type { User } from '@/types/auth';

class UserService extends BaseCrudService<User> {
  constructor() {
    super(db.users);
  }

  /**
   * Get user by username
   */
  async getByUsername(username: string): Promise<User | undefined> {
    return await this.table.where('username').equals(username).first();
  }

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<User | undefined> {
    return await this.table.where('email').equals(email).first();
  }

  /**
   * Get users by role
   */
  async getByRole(role: User['role']): Promise<User[]> {
    return await this.table.where('role').equals(role).toArray();
  }

  /**
   * Get active users
   */
  async getActiveUsers(): Promise<User[]> {
    return await this.table.filter((user) => user.isActive === true).toArray();
  }

  /**
   * Activate/deactivate user
   */
  async setActiveStatus(userId: string, isActive: boolean): Promise<User> {
    return await this.update(userId, { isActive });
  }

  /**
   * Update user's last login time
   */
  async updateLastLogin(userId: string): Promise<User> {
    return await this.update(userId, { lastLogin: new Date() });
  }

  /**
   * Change user role
   */
  async changeRole(userId: string, role: User['role']): Promise<User> {
    return await this.update(userId, { role });
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
    managers: number;
    workers: number;
  }> {
    const all = await this.getAll();

    return {
      total: all.length,
      active: all.filter((u) => u.isActive).length,
      inactive: all.filter((u) => !u.isActive).length,
      admins: all.filter((u) => u.role === 'admin').length,
      managers: all.filter((u) => u.role === 'manager').length,
      workers: all.filter((u) => u.role === 'worker').length,
    };
  }

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string, excludeId?: string): Promise<boolean> {
    const user = await this.getByUsername(username);
    if (!user) return true;
    if (excludeId && user.id === excludeId) return true;
    return false;
  }

  /**
   * Check if email is available
   */
  async isEmailAvailable(email: string, excludeId?: string): Promise<boolean> {
    const user = await this.getByEmail(email);
    if (!user) return true;
    if (excludeId && user.id === excludeId) return true;
    return false;
  }
}

export default new UserService();
