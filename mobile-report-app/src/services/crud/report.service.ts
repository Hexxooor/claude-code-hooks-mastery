import { BaseCrudService } from './base.crud.service';
import db from '@/services/database.service';
import type { Report, ReportFilter, Photo, Material } from '@/types/database';

class ReportService extends BaseCrudService<Report> {
  constructor() {
    super(db.reports);
  }

  /**
   * Get reports by filter criteria
   */
  async getFiltered(filter: ReportFilter): Promise<Report[]> {
    let query = this.table.toCollection();

    if (filter.orderId) {
      query = query.filter(report => report.orderId === filter.orderId);
    }

    if (filter.userId) {
      query = query.filter(report => report.userId === filter.userId);
    }

    if (filter.status) {
      query = query.filter(report => report.status === filter.status);
    }

    if (filter.dateFrom) {
      query = query.filter(report => report.createdAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      query = query.filter(report => report.createdAt <= filter.dateTo!);
    }

    return await query.toArray();
  }

  /**
   * Get reports for a specific order
   */
  async getByOrderId(orderId: string): Promise<Report[]> {
    return await this.table
      .where('orderId')
      .equals(orderId)
      .toArray();
  }

  /**
   * Get reports created by a specific user
   */
  async getByUserId(userId: string): Promise<Report[]> {
    return await this.table
      .where('userId')
      .equals(userId)
      .toArray();
  }

  /**
   * Get reports by status
   */
  async getByStatus(status: Report['status']): Promise<Report[]> {
    return await this.table
      .where('status')
      .equals(status)
      .toArray();
  }

  /**
   * Create a draft report
   */
  async createDraft(
    orderId: string,
    userId: string,
    title: string,
    description: string = ''
  ): Promise<Report> {
    const report: Report = {
      orderId,
      userId,
      title,
      description,
      status: 'draft',
      photos: [],
      materials: [],
      timeEntries: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.create(report);
  }

  /**
   * Add a photo to a report
   */
  async addPhoto(reportId: string, photo: Photo): Promise<Report> {
    const report = await this.getById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Generate ID for photo if not provided
    if (!photo.id) {
      photo.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    photo.reportId = reportId;
    photo.createdAt = new Date();

    // Add photo to database
    await db.photos.add(photo);

    // Update report with photo reference
    const updatedPhotos = [...report.photos, photo];
    return await this.update(reportId, { photos: updatedPhotos });
  }

  /**
   * Remove a photo from a report
   */
  async removePhoto(reportId: string, photoId: string): Promise<Report> {
    const report = await this.getById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Remove photo from database
    await db.photos.delete(photoId);

    // Update report
    const updatedPhotos = report.photos.filter(p => p.id !== photoId);
    return await this.update(reportId, { photos: updatedPhotos });
  }

  /**
   * Add a material to a report
   */
  async addMaterial(reportId: string, material: Material): Promise<Report> {
    const report = await this.getById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Generate ID for material if not provided
    if (!material.id) {
      material.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Calculate total cost
    if (!material.totalCost) {
      material.totalCost = material.quantityUsed * material.unitPrice;
    }

    // Add material to database
    await db.materials.add(material);

    // Update report with material reference
    const updatedMaterials = [...report.materials, material];
    return await this.update(reportId, { materials: updatedMaterials });
  }

  /**
   * Remove a material from a report
   */
  async removeMaterial(reportId: string, materialId: string): Promise<Report> {
    const report = await this.getById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Remove material from database
    await db.materials.delete(materialId);

    // Update report
    const updatedMaterials = report.materials.filter(m => m.id !== materialId);
    return await this.update(reportId, { materials: updatedMaterials });
  }

  /**
   * Add time entries to a report
   */
  async addTimeEntries(reportId: string, timeEntryIds: string[]): Promise<Report> {
    const report = await this.getById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Merge with existing time entries (avoid duplicates)
    const existingIds = new Set(report.timeEntries);
    const newIds = timeEntryIds.filter(id => !existingIds.has(id));
    const updatedTimeEntries = [...report.timeEntries, ...newIds];

    return await this.update(reportId, { timeEntries: updatedTimeEntries });
  }

  /**
   * Add customer signature to a report
   */
  async addSignature(
    reportId: string,
    signature: string,
    customerName: string
  ): Promise<Report> {
    return await this.update(reportId, {
      customerSignature: signature,
      customerName,
      signedAt: new Date(),
    });
  }

  /**
   * Submit a report (change status from draft to submitted)
   */
  async submitReport(reportId: string): Promise<Report> {
    const report = await this.getById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    if (report.status !== 'draft') {
      throw new Error('Only draft reports can be submitted');
    }

    if (!report.customerSignature) {
      throw new Error('Report must be signed before submission');
    }

    return await this.update(reportId, {
      status: 'submitted',
      updatedAt: new Date(),
    });
  }

  /**
   * Approve a report (change status from submitted to approved)
   */
  async approveReport(reportId: string): Promise<Report> {
    const report = await this.getById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    if (report.status !== 'submitted') {
      throw new Error('Only submitted reports can be approved');
    }

    return await this.update(reportId, {
      status: 'approved',
      updatedAt: new Date(),
    });
  }

  /**
   * Get total material cost for a report
   */
  async getTotalMaterialCost(reportId: string): Promise<number> {
    const report = await this.getById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    return report.materials.reduce((total, material) => total + material.totalCost, 0);
  }

  /**
   * Get report statistics
   */
  async getStats(): Promise<{
    total: number;
    draft: number;
    submitted: number;
    approved: number;
    signed: number;
    withPhotos: number;
    withMaterials: number;
  }> {
    const all = await this.getAll();

    return {
      total: all.length,
      draft: all.filter(r => r.status === 'draft').length,
      submitted: all.filter(r => r.status === 'submitted').length,
      approved: all.filter(r => r.status === 'approved').length,
      signed: all.filter(r => r.customerSignature).length,
      withPhotos: all.filter(r => r.photos.length > 0).length,
      withMaterials: all.filter(r => r.materials.length > 0).length,
    };
  }

  /**
   * Clone a report (create a new draft based on existing report)
   */
  async cloneReport(reportId: string, newOrderId?: string): Promise<Report> {
    const original = await this.getById(reportId);
    if (!original) {
      throw new Error('Report not found');
    }

    const cloned: Report = {
      orderId: newOrderId || original.orderId,
      userId: original.userId,
      title: `Copy of ${original.title}`,
      description: original.description,
      status: 'draft',
      photos: [], // Don't copy photos
      materials: [...original.materials], // Copy materials
      timeEntries: [], // Don't copy time entries
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.create(cloned);
  }
}

export default new ReportService();