import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueLoading from 'vue-loading-overlay';
import { darkModeKey, styleKey } from '@/config.js';

// tailwind css
import './css/main.css';
// Loading css
import 'vue-loading-overlay/dist/vue-loading.css';

// Locoal Storage
store.dispatch('token', localStorage['token'] ? localStorage['token'] : null);
store.dispatch('getAttr', localStorage['attrs'] ? localStorage['attrs'] : null);
store.dispatch(
  'getProducts',
  localStorage['products'] ? localStorage['products'] : null
);
store.dispatch(
  'getOnlineOrders',
  localStorage['onlineOrders'] ? localStorage['onlineOrders'] : null
);

/* App style */
if (localStorage[styleKey]) {
  store.dispatch('setStyle', localStorage[styleKey]);
}

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia('(prefers-color-scheme: dark)').matches) ||
  localStorage[darkModeKey] === '1'
) {
  store.dispatch('darkMode', true);
}

/* Default title tag */
const defaultDocumentTitle = 'Alpha Stock';

/* Collapse mobile aside menu on route change */
router.beforeEach(() => {
  store.dispatch('asideMobileToggle', false);
  store.dispatch('asideLgToggle', false);
});

router.afterEach((to) => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${defaultDocumentTitle} — ${to.meta.title}`;
  } else {
    document.title = defaultDocumentTitle;
  }

  /* Full screen mode */
  store.dispatch('fullScreenToggle', !!to.meta.fullScreen);
});

const app = createApp(App).use(store).use(router).use(VueLoading);
// .use(require('vue-jalali-moment'));
app.config.errorHandler = (err) => {
  window.log(err);
};
app.mount('#app');
