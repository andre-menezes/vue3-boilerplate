import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { loadPlugins } from './plugins';

export const app = createApp(App);

loadPlugins(app);

app.mount('#app');
