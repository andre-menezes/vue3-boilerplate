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
    const links = wrapper.findAllComponents(RouterLinkStub);

    expect(links.map((link) => link.text())).toEqual(['Início']);
  });

  it('renderiza Usuários apenas para admin', () => {
    authState.isAdmin = true;

    const wrapper = mountHomeView();
    const links = wrapper.findAllComponents(RouterLinkStub);

    expect(links.map((link) => link.text())).toEqual(['Início', 'Usuários']);
    expect(links[1].props('to')).toEqual({ name: 'Users' });
  });
});
