import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@pages/HomeView.vue'),
    meta: { requiresAuth: true, title: 'Home' },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@pages/UsersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Users' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@pages/LoginView.vue'),
    meta: { requiresAuth: false, title: 'Login' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@pages/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
});

// pinia-plugin-persistedstate v4 restaura estado sincronamente na primeira
// chamada de useAuthStore(), então não há necessidade de espera assíncrona.
router.beforeEach((to) => {
  const auth = useAuthStore();
  const title =
    to.matched
      .slice()
      .reverse()
      .find((r) => r.meta?.title)?.meta?.title ?? 'Vue3 Boilerplate';
  document.title = `${title} | Vue3 Boilerplate`;

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Login' };
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'Home' };
  }

  if (to.name === 'Login' && auth.isAuthenticated) {
    return { name: 'Home' };
  }
});

export default router;
