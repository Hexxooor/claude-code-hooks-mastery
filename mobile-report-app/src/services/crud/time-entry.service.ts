import { BaseCrudService } from './base.crud.service';
import db from '@/services/database.service';
import type { TimeEntry, TimeEntryFilter } from '@/types/database';

class TimeEntryService extends BaseCrudService<TimeEntry> {
  constructor() {
    super(db.timeEntries);
  }

  /**
   * Get time entries by filter criteria
   */
  async getFiltered(filter: TimeEntryFilter): Promise<TimeEntry[]> {
    let query = this.table.toCollection();

    if (filter.userId) {
      query = query.filter(entry => entry.userId === filter.userId);
    }

    if (filter.orderId) {
      query = query.filter(entry => entry.orderId === filter.orderId);
    }

    if (filter.isManual !== undefined) {
      query = query.filter(entry => entry.isManual === filter.isManual);
    }

    if (filter.dateFrom) {
      query = query.filter(entry => entry.startTime >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      query = query.filter(entry => entry.startTime <= filter.dateTo!);
    }

    return await query.toArray();
  }

  /**
   * Get time entries for a specific user
   */
  async getByUserId(userId: string): Promise<TimeEntry[]> {
    return await this.table
      .where('userId')
      .equals(userId)
      .toArray();
  }

  /**
   * Get time entries for a specific order
   */
  async getByOrderId(orderId: string): Promise<TimeEntry[]> {
    return await this.table
      .where('orderId')
      .equals(orderId)
      .toArray();
  }

  /**
   * Get active time entry for a user (timer running)
   */
  async getActiveEntry(userId: string): Promise<TimeEntry | undefined> {
    const entries = await this.table
      .where('userId')
      .equals(userId)
      .filter(entry => !entry.endTime)
      .toArray();

    return entries[0]; // Should only be one active entry per user
  }

  /**
   * Start a new timer for a user
   */
  async startTimer(userId: string, orderId: string, description: string = ''): Promise<TimeEntry> {
    // Check if user already has an active timer
    const activeEntry = await this.getActiveEntry(userId);
    if (activeEntry) {
      throw new Error('User already has an active timer');
    }

    const entry: TimeEntry = {
      userId,
      orderId,
      startTime: new Date(),
      description,
      isManual: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.create(entry);
  }

  /**
   * Stop the active timer for a user
   */
  async stopTimer(userId: string): Promise<TimeEntry> {
    const activeEntry = await this.getActiveEntry(userId);
    if (!activeEntry) {
      throw new Error('No active timer found for user');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeEntry.startTime.getTime()) / 60000); // in minutes

    return await this.update(activeEntry.id!, {
      endTime,
      duration,
      updatedAt: new Date(),
    });
  }

  /**
   * Create a manual time entry
   */
  async createManualEntry(
    userId: string,
    orderId: string,
    startTime: Date,
    endTime: Date,
    description: string = ''
  ): Promise<TimeEntry> {
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000); // in minutes

    if (duration <= 0) {
      throw new Error('End time must be after start time');
    }

    const entry: TimeEntry = {
      userId,
      orderId,
      startTime,
      endTime,
      duration,
      description,
      isManual: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.create(entry);
  }

  /**
   * Get time entries for a date range
   */
  async getByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<TimeEntry[]> {
    let query = this.table
      .where('startTime')
      .between(startDate, endDate);

    if (userId) {
      const entries = await query.toArray();
      return entries.filter(entry => entry.userId === userId);
    }

    return await query.toArray();
  }

  /**
   * Get total time spent on an order
   */
  async getTotalTimeForOrder(orderId: string): Promise<number> {
    const entries = await this.getByOrderId(orderId);
    return entries.reduce((total, entry) => total + (entry.duration || 0), 0);
  }

  /**
   * Get total time spent by a user
   */
  async getTotalTimeForUser(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
    let entries = await this.getByUserId(userId);

    if (startDate) {
      entries = entries.filter(entry => entry.startTime >= startDate);
    }

    if (endDate) {
      entries = entries.filter(entry => entry.startTime <= endDate);
    }

    return entries.reduce((total, entry) => total + (entry.duration || 0), 0);
  }

  /**
   * Get time statistics for a user
   */
  async getUserStats(userId: string, startDate?: Date, endDate?: Date): Promise<{
    totalEntries: number;
    totalMinutes: number;
    totalHours: number;
    averageMinutesPerEntry: number;
    manualEntries: number;
    timerEntries: number;
  }> {
    let entries = await this.getByUserId(userId);

    if (startDate) {
      entries = entries.filter(entry => entry.startTime >= startDate);
    }

    if (endDate) {
      entries = entries.filter(entry => entry.startTime <= endDate);
    }

    const totalMinutes = entries.reduce((total, entry) => total + (entry.duration || 0), 0);

    return {
      totalEntries: entries.length,
      totalMinutes,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      averageMinutesPerEntry: entries.length > 0 ? Math.round(totalMinutes / entries.length) : 0,
      manualEntries: entries.filter(e => e.isManual).length,
      timerEntries: entries.filter(e => !e.isManual).length,
    };
  }

  /**
   * Check for overlapping time entries
   */
  async hasOverlap(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string
  ): Promise<boolean> {
    const userEntries = await this.getByUserId(userId);

    return userEntries.some(entry => {
      if (excludeId && entry.id === excludeId) {
        return false;
      }

      if (!entry.endTime) {
        return false; // Skip active timers
      }

      return (
        (startTime >= entry.startTime && startTime < entry.endTime) ||
        (endTime > entry.startTime && endTime <= entry.endTime) ||
        (startTime <= entry.startTime && endTime >= entry.endTime)
      );
    });
  }
}

export default new TimeEntryService();