import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

// Route definitions
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'worker'] },
  },
  {
    path: '/time-tracking',
    name: 'time-tracking',
    component: () => import('@/views/TimeTrackingView.vue'),
    meta: { requiresAuth: true, roles: ['worker', 'manager', 'admin'] },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/ReportsView.vue'),
    meta: { requiresAuth: true, roles: ['worker', 'manager', 'admin'] },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/UnauthorizedView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guards
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login with return URL
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      });
      return;
    }

    // Check role-based access
    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      const hasRequiredRole = authStore.hasAnyRole(
        to.meta.roles as Array<'admin' | 'manager' | 'worker'>
      );

      if (!hasRequiredRole) {
        // User doesn't have required role
        next({ name: 'unauthorized' });
        return;
      }
    }
  }

  // Check if route is for guests only
  if (to.meta.guest && authStore.isAuthenticated) {
    // Redirect authenticated users away from guest pages
    next({ name: 'dashboard' });
    return;
  }

  // Continue navigation
  next();
});

// After each navigation
router.afterEach((to) => {
  // Update document title
  const title = (to.meta.title as string) || 'Mobile Report App';
  document.title = title;
});

export default router;
