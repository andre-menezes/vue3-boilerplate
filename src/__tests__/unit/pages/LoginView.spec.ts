import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginView from '@/pages/LoginView.vue';

const pushMock = vi.hoisted(() => vi.fn());
const loginMock = vi.hoisted(() => vi.fn());
const registerMock = vi.hoisted(() => vi.fn());

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    login: loginMock,
    register: registerMock,
  }),
}));

function mountLoginView() {
  return mount(LoginView, {
    global: {
      stubs: {
        transition: true,
      },
    },
  });
}

describe('LoginView', () => {
  beforeEach(() => {
    pushMock.mockReset();
    loginMock.mockReset();
    registerMock.mockReset();
  });

  it('faz login com sucesso e navega para Home', async () => {
    loginMock.mockResolvedValueOnce(undefined);
    const wrapper = mountLoginView();

    await wrapper.get('#email').setValue('admin@example.com');
    await wrapper.get('#password').setValue('123456');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(loginMock).toHaveBeenCalledWith('admin@example.com', '123456');
    expect(pushMock).toHaveBeenCalledWith({ name: 'Home' });
  });

  it('exibe alerta quando login falha', async () => {
    loginMock.mockRejectedValueOnce(new Error('Invalid credentials'));
    const wrapper = mountLoginView();

    await wrapper.get('#email').setValue('invalid@example.com');
    await wrapper.get('#password').setValue('wrongpassword');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain('Email ou senha inválidos');
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('alterna para cadastro limpando formulário e erro', async () => {
    loginMock.mockRejectedValueOnce(new Error('Invalid credentials'));
    const wrapper = mountLoginView();

    await wrapper.get('#email').setValue('invalid@example.com');
    await wrapper.get('#password').setValue('wrongpassword');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    await wrapper.get('button[type="button"]').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Criar conta');
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect((wrapper.get('#email').element as HTMLInputElement).value).toBe('');
    expect((wrapper.get('#password').element as HTMLInputElement).value).toBe('');
    expect(wrapper.find('#name').exists()).toBe(true);
  });

  it('faz cadastro com sucesso e navega para Home', async () => {
    registerMock.mockResolvedValueOnce(undefined);
    const wrapper = mountLoginView();

    await wrapper.get('button[type="button"]').trigger('click');
    await wrapper.get('#name').setValue('Regular User');
    await wrapper.get('#email').setValue('user@example.com');
    await wrapper.get('#password').setValue('123456');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(registerMock).toHaveBeenCalledWith('user@example.com', '123456', 'Regular User');
    expect(pushMock).toHaveBeenCalledWith({ name: 'Home' });
  });

  it('desabilita campos e atualiza label durante loading de login', async () => {
    let resolveLogin!: () => void;
    loginMock.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveLogin = resolve;
      })
    );
    const wrapper = mountLoginView();

    await wrapper.get('#email').setValue('admin@example.com');
    await wrapper.get('#password').setValue('123456');
    await wrapper.get('form').trigger('submit');
    await wrapper.vm.$nextTick();

    expect(wrapper.get('button[type="submit"]').text()).toContain('Entrando...');
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined();
    expect(wrapper.get('#email').attributes('disabled')).toBeDefined();
    expect(wrapper.get('#password').attributes('disabled')).toBeDefined();

    resolveLogin();
    await flushPromises();
  });
});
