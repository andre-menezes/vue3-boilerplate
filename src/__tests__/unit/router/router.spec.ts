import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

async function createFreshRouter() {
  vi.resetModules();
  const router = (await import('@/router')).default;
  return router;
}

describe('Router', () => {
  it('redireciona Home para Login quando não há token', async () => {
    setActivePinia(createPinia());
    const router = await createFreshRouter();

    await router.push('/');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('Login');
    expect(document.title).toBe('Login | Vue3 Boilerplate');
  });

  it('redireciona Login para Home quando usuário está autenticado', async () => {
    setActivePinia(createPinia());
    const router = await createFreshRouter();
    const authStore = useAuthStore();
    authStore.token = 'jwt-token';

    await router.push('/login');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('Home');
    expect(document.title).toBe('Home | Vue3 Boilerplate');
  });

  it('permite acessar Home quando usuário está autenticado', async () => {
    setActivePinia(createPinia());
    const router = await createFreshRouter();
    const authStore = useAuthStore();
    authStore.token = 'jwt-token';

    await router.push('/');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('Home');
  });

  it('redireciona Users para Login quando não há token', async () => {
    setActivePinia(createPinia());
    const router = await createFreshRouter();

    await router.push('/users');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('Login');
  });

  it('permite acessar Users quando usuário está autenticado', async () => {
    setActivePinia(createPinia());
    const router = await createFreshRouter();
    const authStore = useAuthStore();
    authStore.token = 'jwt-token';

    await router.push('/users');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('Users');
    expect(document.title).toBe('Users | Vue3 Boilerplate');
  });

  it('renderiza NotFound para rota desconhecida', async () => {
    setActivePinia(createPinia());
    const router = await createFreshRouter();
    const App = defineComponent({ components: { RouterView }, template: '<RouterView />' });

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          AppFooter: true,
          RouterLink: true,
        },
      },
    });

    await router.push('/rota-inexistente');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('NotFound');
    expect(wrapper.text()).toContain('Página não encontrada');
  });
});
