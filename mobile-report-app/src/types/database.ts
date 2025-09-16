// Database entity types
export interface Order {
  id?: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string[]; // User IDs
  estimatedHours: number;
  createdAt: Date;
  dueDate: Date;
  completedAt?: Date;
}

export interface TimeEntry {
  id?: string;
  userId: string;
  orderId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description: string;
  isManual: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id?: string;
  orderId: string;
  userId: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'approved';
  photos: Photo[];
  materials: Material[];
  timeEntries: string[]; // TimeEntry IDs
  customerSignature?: string; // Base64 encoded
  customerName?: string;
  signedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Photo {
  id?: string;
  reportId: string;
  filename: string;
  category: 'before' | 'during' | 'after' | 'material' | 'other';
  caption?: string;
  base64Data: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;
}

export interface Material {
  id?: string;
  name: string;
  code: string;
  unit: string;
  quantityUsed: number;
  unitPrice: number;
  totalCost: number;
  notes?: string;
}

// Query options for filtering
export interface OrderFilter {
  status?: Order['status'];
  priority?: Order['priority'];
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface TimeEntryFilter {
  userId?: string;
  orderId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  isManual?: boolean;
}

export interface ReportFilter {
  orderId?: string;
  userId?: string;
  status?: Report['status'];
  dateFrom?: Date;
  dateTo?: Date;
}