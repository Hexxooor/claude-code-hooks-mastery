import { describe, it, expect, beforeEach, vi } from 'vitest';
import userService from '@/services/crud/user.service';
import type { User } from '@/types/auth';

// Mock the database service
vi.mock('@/services/database.service', () => ({
  default: {
    users: {
      where: vi.fn(),
      filter: vi.fn(),
      add: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn(),
    },
  },
}));

// Mock BaseCrudService
vi.mock('@/services/crud/base.crud.service', () => ({
  BaseCrudService: class {
    table: any;
    constructor(table: any) {
      this.table = table;
    }
    async getAll() {
      return this.table.toArray();
    }
    async getById(id: string) {
      return this.table.get(id);
    }
    async create(data: any) {
      return this.table.add(data);
    }
    async update(id: string, data: any) {
      return this.table.update(id, data);
    }
    async delete(id: string) {
      return this.table.delete(id);
    }
  },
}));

describe('UserService', () => {
  const mockUsers: User[] = [
    {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date('2023-01-01'),
      lastLogin: new Date('2023-12-01'),
    },
    {
      id: 'user-2',
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      role: 'manager',
      isActive: true,
      createdAt: new Date('2023-02-01'),
    },
    {
      id: 'user-3',
      firstName: 'Bob',
      lastName: 'Johnson',
      username: 'bobjohnson',
      email: 'bob@example.com',
      role: 'worker',
      isActive: false,
      createdAt: new Date('2023-03-01'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getByUsername', () => {
    it('should return user by username', async () => {
      const mockUser = mockUsers[0];
      const whereMock = {
        equals: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(mockUser),
        }),
      };

      userService.table.where = vi.fn().mockReturnValue(whereMock);

      const result = await userService.getByUsername('johndoe');

      expect(userService.table.where).toHaveBeenCalledWith('username');
      expect(whereMock.equals).toHaveBeenCalledWith('johndoe');
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if user not found', async () => {
      const whereMock = {
        equals: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(undefined),
        }),
      };

      userService.table.where = vi.fn().mockReturnValue(whereMock);

      const result = await userService.getByUsername('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('getByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = mockUsers[0];
      const whereMock = {
        equals: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(mockUser),
        }),
      };

      userService.table.where = vi.fn().mockReturnValue(whereMock);

      const result = await userService.getByEmail('john@example.com');

      expect(userService.table.where).toHaveBeenCalledWith('email');
      expect(whereMock.equals).toHaveBeenCalledWith('john@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('getByRole', () => {
    it('should return users by role', async () => {
      const adminUsers = [mockUsers[0]];
      const whereMock = {
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue(adminUsers),
        }),
      };

      userService.table.where = vi.fn().mockReturnValue(whereMock);

      const result = await userService.getByRole('admin');

      expect(userService.table.where).toHaveBeenCalledWith('role');
      expect(whereMock.equals).toHaveBeenCalledWith('admin');
      expect(result).toEqual(adminUsers);
    });
  });

  describe('getActiveUsers', () => {
    it('should return only active users', async () => {
      const activeUsers = mockUsers.filter((u) => u.isActive);

      userService.table.filter = vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue(activeUsers),
      });

      const result = await userService.getActiveUsers();

      expect(userService.table.filter).toHaveBeenCalled();
      expect(result).toEqual(activeUsers);
      expect(result.every((u) => u.isActive)).toBe(true);
    });
  });

  describe('setActiveStatus', () => {
    it('should update user active status', async () => {
      const updatedUser = { ...mockUsers[0], isActive: false };

      userService.update = vi.fn().mockResolvedValue(updatedUser);

      const result = await userService.setActiveStatus('user-1', false);

      expect(userService.update).toHaveBeenCalledWith('user-1', { isActive: false });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('updateLastLogin', () => {
    it('should update user last login time', async () => {
      const loginDate = new Date();
      const updatedUser = { ...mockUsers[0], lastLogin: loginDate };

      userService.update = vi.fn().mockResolvedValue(updatedUser);

      const result = await userService.updateLastLogin('user-1');

      expect(userService.update).toHaveBeenCalledWith('user-1', { lastLogin: expect.any(Date) });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('changeRole', () => {
    it('should update user role', async () => {
      const updatedUser = { ...mockUsers[0], role: 'manager' as const };

      userService.update = vi.fn().mockResolvedValue(updatedUser);

      const result = await userService.changeRole('user-1', 'manager');

      expect(userService.update).toHaveBeenCalledWith('user-1', { role: 'manager' });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('getStats', () => {
    it('should return user statistics', async () => {
      userService.getAll = vi.fn().mockResolvedValue(mockUsers);

      const result = await userService.getStats();

      expect(result).toEqual({
        total: 3,
        active: 2,
        inactive: 1,
        admins: 1,
        managers: 1,
        workers: 1,
      });
    });

    it('should handle empty user list', async () => {
      userService.getAll = vi.fn().mockResolvedValue([]);

      const result = await userService.getStats();

      expect(result).toEqual({
        total: 0,
        active: 0,
        inactive: 0,
        admins: 0,
        managers: 0,
        workers: 0,
      });
    });
  });

  describe('isUsernameAvailable', () => {
    it('should return true if username is available', async () => {
      userService.getByUsername = vi.fn().mockResolvedValue(undefined);

      const result = await userService.isUsernameAvailable('newuser');

      expect(userService.getByUsername).toHaveBeenCalledWith('newuser');
      expect(result).toBe(true);
    });

    it('should return false if username is taken', async () => {
      userService.getByUsername = vi.fn().mockResolvedValue(mockUsers[0]);

      const result = await userService.isUsernameAvailable('johndoe');

      expect(result).toBe(false);
    });

    it('should return true if username belongs to excluded user', async () => {
      userService.getByUsername = vi.fn().mockResolvedValue(mockUsers[0]);

      const result = await userService.isUsernameAvailable('johndoe', 'user-1');

      expect(result).toBe(true);
    });
  });

  describe('isEmailAvailable', () => {
    it('should return true if email is available', async () => {
      userService.getByEmail = vi.fn().mockResolvedValue(undefined);

      const result = await userService.isEmailAvailable('new@example.com');

      expect(userService.getByEmail).toHaveBeenCalledWith('new@example.com');
      expect(result).toBe(true);
    });

    it('should return false if email is taken', async () => {
      userService.getByEmail = vi.fn().mockResolvedValue(mockUsers[0]);

      const result = await userService.isEmailAvailable('john@example.com');

      expect(result).toBe(false);
    });

    it('should return true if email belongs to excluded user', async () => {
      userService.getByEmail = vi.fn().mockResolvedValue(mockUsers[0]);

      const result = await userService.isEmailAvailable('john@example.com', 'user-1');

      expect(result).toBe(true);
    });
  });

  describe('CRUD Operations', () => {
    it('should create a new user', async () => {
      const newUser: Partial<User> = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'worker',
        isActive: true,
      };

      userService.create = vi.fn().mockResolvedValue({ ...newUser, id: 'user-4' });

      const result = await userService.create(newUser);

      expect(userService.create).toHaveBeenCalledWith(newUser);
      expect(result.id).toBeDefined();
    });

    it('should get user by id', async () => {
      userService.getById = vi.fn().mockResolvedValue(mockUsers[0]);

      const result = await userService.getById('user-1');

      expect(userService.getById).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUsers[0]);
    });

    it('should update user', async () => {
      const updateData = { firstName: 'Updated' };
      const updatedUser = { ...mockUsers[0], ...updateData };

      userService.update = vi.fn().mockResolvedValue(updatedUser);

      const result = await userService.update('user-1', updateData);

      expect(userService.update).toHaveBeenCalledWith('user-1', updateData);
      expect(result.firstName).toBe('Updated');
    });

    it('should delete user', async () => {
      userService.delete = vi.fn().mockResolvedValue(undefined);

      await userService.delete('user-1');

      expect(userService.delete).toHaveBeenCalledWith('user-1');
    });

    it('should get all users', async () => {
      userService.getAll = vi.fn().mockResolvedValue(mockUsers);

      const result = await userService.getAll();

      expect(result).toEqual(mockUsers);
    });
  });
});
