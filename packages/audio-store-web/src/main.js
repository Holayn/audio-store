import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './index.css';

const app = createApp(App);

app.config.errorHandler = (err) => {
  alert(err);
};

app.use(store).use(router).mount('#app');

window.addEventListener('error', (e) => {
  alert(e.error.message);
  return false;
});
