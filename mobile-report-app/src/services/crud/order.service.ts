import { BaseCrudService } from './base.crud.service';
import db from '@/services/database.service';
import type { Order, OrderFilter } from '@/types/database';

class OrderService extends BaseCrudService<Order> {
  constructor() {
    super(db.orders);
  }

  /**
   * Get orders by filter criteria
   */
  async getFiltered(filter: OrderFilter): Promise<Order[]> {
    let query = this.table.toCollection();

    if (filter.status) {
      query = query.filter(order => order.status === filter.status);
    }

    if (filter.priority) {
      query = query.filter(order => order.priority === filter.priority);
    }

    if (filter.assignedTo) {
      query = query.filter(order => order.assignedTo.includes(filter.assignedTo!));
    }

    if (filter.dateFrom) {
      query = query.filter(order => order.createdAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      query = query.filter(order => order.createdAt <= filter.dateTo!);
    }

    return await query.toArray();
  }

  /**
   * Get orders assigned to a specific user
   */
  async getByUserId(userId: string): Promise<Order[]> {
    return await this.table
      .filter(order => order.assignedTo.includes(userId))
      .toArray();
  }

  /**
   * Get orders by status
   */
  async getByStatus(status: Order['status']): Promise<Order[]> {
    return await this.table
      .where('status')
      .equals(status)
      .toArray();
  }

  /**
   * Get orders by priority
   */
  async getByPriority(priority: Order['priority']): Promise<Order[]> {
    return await this.table
      .where('priority')
      .equals(priority)
      .toArray();
  }

  /**
   * Get orders due within a date range
   */
  async getDueInRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return await this.table
      .where('dueDate')
      .between(startDate, endDate)
      .toArray();
  }

  /**
   * Get overdue orders
   */
  async getOverdue(): Promise<Order[]> {
    const now = new Date();
    return await this.table
      .where('dueDate')
      .below(now)
      .and(order => order.status !== 'completed' && order.status !== 'cancelled')
      .toArray();
  }

  /**
   * Update order status
   */
  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    const updateData: Partial<Order> = { status };

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    return await this.update(id, updateData);
  }

  /**
   * Assign order to users
   */
  async assignToUsers(orderId: string, userIds: string[]): Promise<Order> {
    return await this.update(orderId, { assignedTo: userIds });
  }

  /**
   * Get order statistics
   */
  async getStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
  }> {
    const all = await this.getAll();
    const now = new Date();

    return {
      total: all.length,
      pending: all.filter(o => o.status === 'pending').length,
      inProgress: all.filter(o => o.status === 'in_progress').length,
      completed: all.filter(o => o.status === 'completed').length,
      cancelled: all.filter(o => o.status === 'cancelled').length,
      overdue: all.filter(o =>
        o.dueDate < now &&
        o.status !== 'completed' &&
        o.status !== 'cancelled'
      ).length,
    };
  }

  /**
   * Search orders by text
   */
  async search(searchText: string): Promise<Order[]> {
    const text = searchText.toLowerCase();
    return await this.table
      .filter(order =>
        order.orderNumber.toLowerCase().includes(text) ||
        order.customerName.toLowerCase().includes(text) ||
        order.description.toLowerCase().includes(text) ||
        order.customerAddress.toLowerCase().includes(text)
      )
      .toArray();
  }
}

export default new OrderService();