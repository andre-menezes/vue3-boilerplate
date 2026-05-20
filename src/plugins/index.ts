import { i18n } from '@/i18n';
import router from '@/router';
import pinia from '@/stores';
import type { App } from 'vue';

export const loadPlugins = async (app: App) => {
  app.use(pinia);
  app.use(router);
  app.use(i18n);
  // Install your component library here, e.g.:
  //   import { createVuetify } from 'vuetify'
  //   app.use(createVuetify())
};
