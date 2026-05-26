import { mount, RouterLinkStub } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import HomeView from '@/pages/HomeView.vue';

const authState = vi.hoisted(() => ({
  isAdmin: false,
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authState,
}));

function mountHomeView() {
  return mount(HomeView, {
    global: {
      stubs: {
        AppFooter: true,
        AppNavbar: defineComponent({
          template: '<header><slot /></header>',
        }),
        RouterLink: RouterLinkStub,
      },
    },
  });
}

describe('HomeView', () => {
  beforeEach(() => {
    authState.isAdmin = false;
  });

  it('renderiza navegação sem o item Funcionalidades para usuário comum', () => {
    const wrapper = mountHomeView();

    expect(wrapper.get('header').text()).toContain('Início');
    expect(wrapper.get('header').text()).not.toContain('Funcionalidades');
    expect(wrapper.get('header').text()).not.toContain('Usuários');
    expect(wrapper.text()).toContain('Meu perfil');
    expect(wrapper.text()).toContain('Áreas administrativas ficam ocultas');
  });

  it('renderiza Usuários apenas para admin', () => {
    authState.isAdmin = true;

    const wrapper = mountHomeView();
    const links = wrapper.findAllComponents(RouterLinkStub);

    expect(wrapper.get('header').text()).toContain('Início');
    expect(wrapper.get('header').text()).toContain('Usuários');
    expect(wrapper.get('header').text()).not.toContain('Funcionalidades');
    expect(links[1].props('to')).toEqual({ name: 'Users' });
    expect(wrapper.text()).toContain('Gestão de usuários');
  });
});
