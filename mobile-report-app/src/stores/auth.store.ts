import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from '@/services/auth.service';
import type { User, LoginCredentials } from '@/types/auth';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const fullName = computed(() => {
    if (!user.value) return '';
    return `${user.value.firstName} ${user.value.lastName}`;
  });

  // Check if user has specific role
  const hasRole = (role: 'admin' | 'manager' | 'worker'): boolean => {
    if (!user.value) return false;

    // Admin has access to everything
    if (user.value.role === 'admin') return true;

    // Manager has access to manager and worker roles
    if (user.value.role === 'manager' && (role === 'manager' || role === 'worker')) {
      return true;
    }

    // Worker only has worker role
    return user.value.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: Array<'admin' | 'manager' | 'worker'>): boolean => {
    return roles.some((role) => hasRole(role));
  };

  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);

      user.value = response.user;
      token.value = response.token;
      refreshToken.value = response.refreshToken || null;

      // Store in localStorage if remember me is checked
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }

      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await authService.logout();

      // Clear state
      user.value = null;
      token.value = null;
      refreshToken.value = null;

      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const refreshAuthToken = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available');
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.refreshToken(refreshToken.value);

      user.value = response.user;
      token.value = response.token;
      refreshToken.value = response.refreshToken || null;

      // Update localStorage
      localStorage.setItem('auth_token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }
      localStorage.setItem('auth_user', JSON.stringify(response.user));

      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Token refresh failed';

      // If refresh fails, logout the user
      await logout();
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const initializeAuth = () => {
    // Check for existing auth data in localStorage
    const storedToken = authService.getToken();
    const storedUser = authService.getCurrentUser();
    const storedRefreshToken = authService.getRefreshToken();

    if (storedToken && storedUser) {
      // Check if token is expired
      if (authService.isTokenExpired(storedToken)) {
        // Try to refresh if we have a refresh token
        if (storedRefreshToken) {
          refreshAuthToken().catch(() => {
            // If refresh fails, clear auth
            logout();
          });
        } else {
          // No refresh token, clear auth
          logout();
        }
      } else {
        // Token is valid, restore session
        token.value = storedToken;
        user.value = storedUser;
        refreshToken.value = storedRefreshToken;
      }
    }
  };

  // Auto-refresh token before expiry
  const setupTokenRefresh = () => {
    if (!token.value) return;

    try {
      const [, payloadStr] = token.value.split('.');
      const payload = JSON.parse(atob(payloadStr));
      const expiryTime = payload.exp;
      const now = Date.now();

      // Refresh 5 minutes before expiry
      const refreshTime = expiryTime - now - 5 * 60 * 1000;

      if (refreshTime > 0) {
        setTimeout(() => {
          if (refreshToken.value) {
            refreshAuthToken();
          }
        }, refreshTime);
      }
    } catch (err) {
      console.error('Failed to setup token refresh:', err);
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    userRole,
    fullName,

    // Methods
    hasRole,
    hasAnyRole,
    login,
    logout,
    refreshAuthToken,
    initializeAuth,
    setupTokenRefresh,
    clearError,
  };
});
