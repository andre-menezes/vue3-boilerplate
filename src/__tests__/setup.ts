import { afterEach, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  sessionStorage.clear();
  document.title = '';
  window.scrollTo = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});
