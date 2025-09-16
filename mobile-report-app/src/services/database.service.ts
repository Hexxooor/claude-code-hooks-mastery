import Dexie, { type Table } from 'dexie';
import type { User } from '@/types/auth';
import type { Order, TimeEntry, Report, Photo, Material } from '@/types/database';

// Define the database class
export class MobileReportDatabase extends Dexie {
  // Declare tables
  users!: Table<User>;
  orders!: Table<Order>;
  timeEntries!: Table<TimeEntry>;
  reports!: Table<Report>;
  photos!: Table<Photo>;
  materials!: Table<Material>;

  constructor() {
    super('MobileReportDB');

    // Define database schema
    this.version(1).stores({
      // User collection with indexes
      users: '++id, username, email, role, isActive',

      // Order collection with indexes
      orders: '++id, orderNumber, status, priority, *assignedTo, createdAt, dueDate',

      // Time entry collection with indexes
      timeEntries: '++id, userId, orderId, startTime, endTime, isManual, createdAt',

      // Report collection with indexes
      reports: '++id, orderId, userId, status, createdAt, updatedAt',

      // Photo collection with indexes
      photos: '++id, reportId, category, createdAt',

      // Material collection with indexes
      materials: '++id, name, code',
    });

    // Hook to generate IDs if not provided
    this.users.hook('creating', function(_primKey, obj) {
      if (!obj.id) {
        obj.id = generateId();
      }
      if (!obj.createdAt) {
        obj.createdAt = new Date();
      }
    });

    this.orders.hook('creating', function(_primKey, obj) {
      if (!obj.id) {
        obj.id = generateId();
      }
      if (!obj.createdAt) {
        obj.createdAt = new Date();
      }
    });

    this.timeEntries.hook('creating', function(_primKey, obj) {
      if (!obj.id) {
        obj.id = generateId();
      }
      if (!obj.createdAt) {
        obj.createdAt = new Date();
      }
      if (!obj.updatedAt) {
        obj.updatedAt = new Date();
      }
    });

    this.reports.hook('creating', function(_primKey, obj) {
      if (!obj.id) {
        obj.id = generateId();
      }
      if (!obj.createdAt) {
        obj.createdAt = new Date();
      }
      if (!obj.updatedAt) {
        obj.updatedAt = new Date();
      }
      // Initialize arrays if not provided
      if (!obj.photos) {
        obj.photos = [];
      }
      if (!obj.materials) {
        obj.materials = [];
      }
      if (!obj.timeEntries) {
        obj.timeEntries = [];
      }
    });

    this.photos.hook('creating', function(_primKey, obj) {
      if (!obj.id) {
        obj.id = generateId();
      }
      if (!obj.createdAt) {
        obj.createdAt = new Date();
      }
    });

    this.materials.hook('creating', function(_primKey, obj) {
      if (!obj.id) {
        obj.id = generateId();
      }
      // Calculate total cost if not provided
      if (!obj.totalCost && obj.quantityUsed && obj.unitPrice) {
        obj.totalCost = obj.quantityUsed * obj.unitPrice;
      }
    });

    // Hook for updating timestamps
    this.timeEntries.hook('updating', function(modifications: any) {
      modifications.updatedAt = new Date();
    });

    this.reports.hook('updating', function(modifications: any) {
      modifications.updatedAt = new Date();
    });
  }

  // Clear all data (useful for testing and development)
  async clearAllData(): Promise<void> {
    await this.transaction('rw', [
      this.users,
      this.orders,
      this.timeEntries,
      this.reports,
      this.photos,
      this.materials
    ], async () => {
      await this.users.clear();
      await this.orders.clear();
      await this.timeEntries.clear();
      await this.reports.clear();
      await this.photos.clear();
      await this.materials.clear();
    });
  }

  // Get database statistics
  async getStats(): Promise<{
    users: number;
    orders: number;
    timeEntries: number;
    reports: number;
    photos: number;
    materials: number;
    storageUsed?: number;
  }> {
    const [users, orders, timeEntries, reports, photos, materials] = await Promise.all([
      this.users.count(),
      this.orders.count(),
      this.timeEntries.count(),
      this.reports.count(),
      this.photos.count(),
      this.materials.count(),
    ]);

    let storageUsed = undefined;
    // Try to get storage estimate if available
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        storageUsed = estimate.usage;
      } catch (error) {
        console.error('Failed to get storage estimate:', error);
      }
    }

    return {
      users,
      orders,
      timeEntries,
      reports,
      photos,
      materials,
      storageUsed,
    };
  }

  // Check if database needs seeding
  async needsSeeding(): Promise<boolean> {
    const userCount = await this.users.count();
    const orderCount = await this.orders.count();
    return userCount === 0 || orderCount === 0;
  }
}

// Helper function to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Create and export a single database instance
const db = new MobileReportDatabase();

// Open the database
db.open().catch((error) => {
  console.error('Failed to open database:', error);
});

export default db;