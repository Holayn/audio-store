import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './index.css';

const app = createApp(App);

app.config.errorHandler = (err) => {
  alert(err);
  console.error(err);
};

app.use(store).use(router).mount('#app');

window.addEventListener('error', (err) => {
  alert(err.error.message);
  console.error(err);
  return false;
});
