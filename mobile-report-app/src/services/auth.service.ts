import type { User, LoginCredentials, AuthResponse } from '@/types/auth';

// Mock users for development
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@mobilereport.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    password: 'Admin123!',
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
    password: 'Manager123!',
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
    password: 'Worker123!',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
  },
];

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';
  private readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generate a mock JWT token
   */
  private generateMockToken(userId: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: userId,
        iat: Date.now(),
        exp: Date.now() + this.TOKEN_EXPIRY,
      })
    );
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Authenticate user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user by username
    const user = MOCK_USERS.find((u) => u.username === credentials.username);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Check password
    if (user.password !== credentials.password) {
      throw new Error('Invalid username or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    // Generate tokens
    const token = this.generateMockToken(user.id);
    const refreshToken = this.generateMockToken(`refresh-${user.id}`);

    // Update last login
    user.lastLogin = new Date();

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    // Store in localStorage if remember me
    if (credentials.rememberMe) {
      this.saveAuthData(token, refreshToken, userWithoutPassword);
    }

    return {
      user: userWithoutPassword,
      token,
      refreshToken,
      expiresIn: this.TOKEN_EXPIRY,
    };
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Clear all auth data
    this.clearAuthData();
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Parse the refresh token to get user ID
    try {
      const [, payloadStr] = refreshToken.split('.');
      const payload = JSON.parse(atob(payloadStr));
      const userId = payload.sub.replace('refresh-', '');

      // Find user
      const user = MOCK_USERS.find((u) => u.id === userId);
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const newToken = this.generateMockToken(user.id);
      const newRefreshToken = this.generateMockToken(`refresh-${user.id}`);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Update stored tokens
      this.saveAuthData(newToken, newRefreshToken, userWithoutPassword);

      return {
        user: userWithoutPassword,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: this.TOKEN_EXPIRY,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Get current token from storage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const [, payloadStr] = token.split('.');
      const payload = JSON.parse(atob(payloadStr));
      return payload.exp < Date.now();
    } catch {
      return true;
    }
  }

  /**
   * Save authentication data to localStorage
   */
  private saveAuthData(token: string, refreshToken: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear authentication data from localStorage
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new AuthService();
