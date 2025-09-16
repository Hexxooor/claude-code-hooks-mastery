import db from './database.service';
import { userService, orderService, timeEntryService, reportService } from './crud';
import type { User } from '@/types/auth';
import type { Order, TimeEntry, Report, Material } from '@/types/database';

/**
 * Service for seeding the database with mock data for development
 */
class SeedService {
  /**
   * Seed all data
   */
  async seedAll(): Promise<void> {
    console.log('Starting database seeding...');

    // Check if database already has data
    const needsSeeding = await db.needsSeeding();
    if (!needsSeeding) {
      console.log('Database already contains data, skipping seeding');
      return;
    }

    // Clear existing data
    await db.clearAllData();

    // Seed in order
    await this.seedUsers();
    await this.seedOrders();
    await this.seedTimeEntries();
    await this.seedReports();

    console.log('Database seeding completed successfully');
  }

  /**
   * Seed users (already in auth service, but add to DB too)
   */
  private async seedUsers(): Promise<void> {
    const users: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@mobilereport.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(),
      },
      {
        id: '2',
        username: 'manager',
        email: 'manager@mobilereport.com',
        firstName: 'Manager',
        lastName: 'User',
        role: 'manager',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(),
      },
      {
        id: '3',
        username: 'worker',
        email: 'worker@mobilereport.com',
        firstName: 'Worker',
        lastName: 'User',
        role: 'worker',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(),
      },
      {
        id: '4',
        username: 'john.smith',
        email: 'john.smith@mobilereport.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'worker',
        isActive: true,
        createdAt: new Date('2024-02-01'),
      },
      {
        id: '5',
        username: 'jane.doe',
        email: 'jane.doe@mobilereport.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'worker',
        isActive: true,
        createdAt: new Date('2024-02-15'),
      },
    ];

    await userService.createMany(users);
    console.log(`Seeded ${users.length} users`);
  }

  /**
   * Seed orders
   */
  private async seedOrders(): Promise<void> {
    const now = new Date();
    const orders: Order[] = [
      {
        id: 'order-1',
        orderNumber: 'WO-2024-001',
        customerName: 'Schmidt Construction',
        customerAddress: '123 Main St, Berlin, Germany',
        description: 'Kitchen renovation - complete remodeling including plumbing and electrical',
        status: 'in_progress',
        priority: 'high',
        assignedTo: ['3', '4'],
        estimatedHours: 40,
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        id: 'order-2',
        orderNumber: 'WO-2024-002',
        customerName: 'Mueller Residence',
        customerAddress: '456 Oak Ave, Munich, Germany',
        description: 'Bathroom plumbing repair - fix leaking pipes and replace fixtures',
        status: 'pending',
        priority: 'urgent',
        assignedTo: ['3'],
        estimatedHours: 8,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      },
      {
        id: 'order-3',
        orderNumber: 'WO-2024-003',
        customerName: 'Weber Office Building',
        customerAddress: '789 Business Park, Hamburg, Germany',
        description: 'Office electrical installation - new lighting and power outlets',
        status: 'in_progress',
        priority: 'medium',
        assignedTo: ['4', '5'],
        estimatedHours: 24,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      },
      {
        id: 'order-4',
        orderNumber: 'WO-2024-004',
        customerName: 'Fischer Automotive',
        customerAddress: '321 Industrial Rd, Frankfurt, Germany',
        description: 'Workshop HVAC system maintenance and filter replacement',
        status: 'completed',
        priority: 'low',
        assignedTo: ['5'],
        estimatedHours: 6,
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        completedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      },
      {
        id: 'order-5',
        orderNumber: 'WO-2024-005',
        customerName: 'Becker Retail Store',
        customerAddress: '654 Shopping Plaza, Cologne, Germany',
        description: 'Store front window replacement and frame repair',
        status: 'pending',
        priority: 'medium',
        assignedTo: ['3', '4'],
        estimatedHours: 16,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      },
      {
        id: 'order-6',
        orderNumber: 'WO-2024-006',
        customerName: 'Klein Restaurant',
        customerAddress: '987 Food Court, Stuttgart, Germany',
        description: 'Kitchen equipment installation and ventilation system upgrade',
        status: 'in_progress',
        priority: 'high',
        assignedTo: ['3', '4', '5'],
        estimatedHours: 32,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      },
    ];

    await orderService.createMany(orders);
    console.log(`Seeded ${orders.length} orders`);
  }

  /**
   * Seed time entries
   */
  private async seedTimeEntries(): Promise<void> {
    const now = new Date();
    const timeEntries: TimeEntry[] = [
      // Worker's time entries for order-1
      {
        id: 'time-1',
        userId: '3',
        orderId: 'order-1',
        startTime: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 6 days ago at 8am
        endTime: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), // 6 days ago at 12pm
        duration: 240, // 4 hours
        description: 'Kitchen demolition and prep work',
        isManual: false,
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'time-2',
        userId: '3',
        orderId: 'order-1',
        startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 5 days ago at 9am
        endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 5 days ago at 5pm
        duration: 480, // 8 hours
        description: 'Plumbing rough-in installation',
        isManual: false,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      // John Smith's time entries
      {
        id: 'time-3',
        userId: '4',
        orderId: 'order-1',
        startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 5 days ago at 8am
        endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 5 days ago at 4pm
        duration: 480, // 8 hours
        description: 'Electrical wiring and outlet installation',
        isManual: false,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'time-4',
        userId: '4',
        orderId: 'order-3',
        startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // 2 days ago at 1pm
        endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 2 days ago at 5pm
        duration: 240, // 4 hours
        description: 'Office lighting installation - conference room',
        isManual: true,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      // Jane Doe's time entries
      {
        id: 'time-5',
        userId: '5',
        orderId: 'order-3',
        startTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // Yesterday at 8am
        endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), // Yesterday at 12pm
        duration: 240, // 4 hours
        description: 'Power outlet installation - workstations',
        isManual: false,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'time-6',
        userId: '5',
        orderId: 'order-4',
        startTime: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 8 days ago at 10am
        endTime: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 8 days ago at 4pm
        duration: 360, // 6 hours
        description: 'HVAC maintenance and filter replacement',
        isManual: false,
        createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      },
      // Current active timer for worker
      {
        id: 'time-7',
        userId: '3',
        orderId: 'order-6',
        startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        description: 'Kitchen equipment installation in progress',
        isManual: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
    ];

    await timeEntryService.createMany(timeEntries);
    console.log(`Seeded ${timeEntries.length} time entries`);
  }

  /**
   * Seed reports
   */
  private async seedReports(): Promise<void> {
    const now = new Date();

    // Create materials for reports
    const materials: Material[] = [
      {
        id: 'mat-1',
        name: 'Copper Pipe 15mm',
        code: 'CP-15',
        unit: 'meter',
        quantityUsed: 10,
        unitPrice: 8.5,
        totalCost: 85.0,
      },
      {
        id: 'mat-2',
        name: 'PVC Fitting',
        code: 'PVC-FIT-90',
        unit: 'piece',
        quantityUsed: 5,
        unitPrice: 2.3,
        totalCost: 11.5,
      },
      {
        id: 'mat-3',
        name: 'Electrical Cable 2.5mm',
        code: 'EC-2.5',
        unit: 'meter',
        quantityUsed: 50,
        unitPrice: 1.2,
        totalCost: 60.0,
      },
      {
        id: 'mat-4',
        name: 'LED Light Fixture',
        code: 'LED-CEIL-40W',
        unit: 'piece',
        quantityUsed: 8,
        unitPrice: 45.0,
        totalCost: 360.0,
      },
    ];

    const reports: Report[] = [
      {
        id: 'report-1',
        orderId: 'order-4',
        userId: '5',
        title: 'HVAC Maintenance Completion Report',
        description:
          'Completed routine maintenance on workshop HVAC system. All filters replaced, system cleaned and tested.',
        status: 'approved',
        photos: [],
        materials: [materials[0], materials[1]],
        timeEntries: ['time-6'],
        customerSignature:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        customerName: 'Hans Fischer',
        signedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'report-2',
        orderId: 'order-1',
        userId: '3',
        title: 'Kitchen Renovation Progress Report',
        description:
          'Phase 1 completed: Demolition and plumbing rough-in. Ready for inspection before proceeding with electrical work.',
        status: 'submitted',
        photos: [],
        materials: [materials[0], materials[1]],
        timeEntries: ['time-1', 'time-2'],
        customerSignature:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        customerName: 'Klaus Schmidt',
        signedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'report-3',
        orderId: 'order-3',
        userId: '4',
        title: 'Office Electrical Installation - Draft',
        description:
          'Partial installation completed for conference room. Pending completion of workstation areas.',
        status: 'draft',
        photos: [],
        materials: [materials[2], materials[3]],
        timeEntries: ['time-3', 'time-4'],
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    // Add materials to database first
    await db.materials.bulkAdd(materials);

    // Then add reports
    await reportService.createMany(reports);
    console.log(`Seeded ${reports.length} reports with ${materials.length} materials`);
  }

  /**
   * Clear all data from the database
   */
  async clearAll(): Promise<void> {
    await db.clearAllData();
    console.log('All data cleared from database');
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<any> {
    return await db.getStats();
  }
}

export default new SeedService();
