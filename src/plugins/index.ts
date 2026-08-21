import { i18n } from '@/i18n';
import router from '@/router';
import pinia from '@/stores';
import type { App } from 'vue';
import SIcon from '@/components/icons/SIcon.vue';
import { useAuthStore } from '@/stores/auth';

export const loadPlugins = async (app: App) => {
  app.use(pinia);
  app.use(router);
  app.use(i18n);
  app.component('s-icon', SIcon);

  const authStore = useAuthStore();
  await authStore.restoreSession();

  // Install your component library here, e.g.:
  //   import { createVuetify } from 'vuetify'
  //   app.use(createVuetify())
};
