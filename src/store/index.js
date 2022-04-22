import { createStore } from 'vuex';
import axios from 'axios';
import { useLoading } from 'vue-loading-overlay';
import { darkModeKey, styleKey } from '@/config.js';
import * as styles from '@/styles.js';

const $loading = useLoading();

export default createStore({
  state: {
    /* Styles */
    lightBorderStyle: '',
    lightBgStyle: '',
    asideStyle: '',
    asideBrandStyle: '',
    asideMenuCloseLgStyle: '',
    asideMenuLabelStyle: '',
    asideMenuItemStyle: '',
    asideMenuItemActiveStyle: '',
    asideMenuItemInactiveStyle: '',
    asideSubmenuListStyle: '',
    navBarItemLabelStyle: '',
    navBarItemLabelHoverStyle: '',
    navBarItemLabelActiveColorStyle: '',
    navBarMenuListUpperLabelStyle: '',
    tableTrStyle: '',
    tableTrOddStyle: '',
    overlayStyle: '',

    /* fullScreen - fullscreen form layout (e.g. login page) */
    isFullScreen: true,

    /* Aside */
    isAsideMobileExpanded: false,
    isAsideLgActive: false,

    /* Dark mode */
    darkMode: false,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Notification */
    notification: {
      show: false,
      message: '',
      color: '',
    },

    /* token */
    token: '',

    /* Attributes and Attribute Terms */
    attrs: [],

    /* Sample data */
    products: null,
  },
  mutations: {
    /* A fit-them-all commit */
    basic(state, payload) {
      state[payload.key] = payload.value;
    },

    /* Styles */
    styles(state, payload) {
      for (const key in payload) {
        if (['body', 'html'].includes(key)) {
          continue;
        }

        state[`${key}Style`] = payload[key];
      }
    },

    notification(state, payload) {
      if (payload.message) {
        state.notification.message = payload.message;
      }
      if (payload.color) {
        state.notification.color = payload.color;
      }
    },
  },
  actions: {
    setStyle({ commit }, payload) {
      const style = styles[payload] ?? styles.basic;

      document.body.className = style.body;
      document.documentElement.className = style.html;

      if (localStorage[styleKey] !== payload) {
        localStorage.setItem(styleKey, payload);
      }

      commit('styles', style);
    },

    asideMobileToggle({ commit, state }, payload = null) {
      const isShow = payload !== null ? payload : !state.isAsideMobileExpanded;

      document
        .getElementById('app')
        .classList[isShow ? 'add' : 'remove']('mr-60', 'lg:mr-0');

      document.documentElement.classList[isShow ? 'add' : 'remove'](
        'm-clipped'
      );

      commit('basic', {
        key: 'isAsideMobileExpanded',
        value: isShow,
      });
    },

    asideLgToggle({ commit, state }, payload = null) {
      commit('basic', {
        key: 'isAsideLgActive',
        value: payload !== null ? payload : !state.isAsideLgActive,
      });
    },

    fullScreenToggle({ commit }, value) {
      commit('basic', { key: 'isFullScreen', value });

      document.documentElement.classList[value ? 'add' : 'remove'](
        'full-screen'
      );
    },

    darkMode({ commit, state }, payload = null) {
      const value = payload !== null ? payload : !state.darkMode;

      document.documentElement.classList[value ? 'add' : 'remove']('dark');

      localStorage.setItem(darkModeKey, value ? '1' : '0');

      commit('basic', {
        key: 'darkMode',
        value,
      });
    },

    // get token
    async token({ commit, dispatch }, payload = null) {
      if (payload) {
        try {
          await axios.post(
            'https://www.alpha-stock.com/wp-json/jwt-auth/v1/token/validate',
            {},
            { headers: { authorization: 'Bearer ' + payload } }
          );
          commit('basic', {
            key: 'token',
            value: payload,
          });
        } catch (error) {
          if (error?.response.data.message === 'Expired token') {
            dispatch('token');
          }
          dispatch('error', error);
        }
      } else {
        try {
          const res = await axios.post(
            'https://www.alpha-stock.com/wp-json/jwt-auth/v1/token',
            {
              username: 'asotaher',
              password: 'T@5()voEYJTOSj0@#ZjqRXVD',
            }
          );
          commit('basic', {
            key: 'token',
            value: res.data.token,
          });
          localStorage.setItem('token', res.data.token);
        } catch (error) {
          dispatch('error', error);
        }
      }
    },

    // get product attributes and attribute terms
    async getAttr({ commit, dispatch }, payload = null) {
      if (payload) {
        commit('basic', {
          key: 'attrs',
          value: JSON.parse(payload),
        });
      } else {
        const loader = $loading.show({
          color: '#ffffff',
          backgroundColor: '#000000',
          canCancel: true,
        });
        try {
          const res = await window.api.get('products/attributes');
          const attrs = [];
          for (const attr of res.data) {
            const res = await window.api.get(
              `products/attributes/${attr.id}/terms`,
              {
                per_page: 100,
              }
            );
            if (res.status !== 200) {
              dispatch('notif', {
                message: 'خطایی رخ داده است!',
                color: 'danger',
              });
            } else {
              const terms = [];
              for (const term of res.data) {
                terms.push({
                  id: term.id,
                  name: term.name,
                  slug: term.slug,
                });
              }
              attrs.push({
                id: attr.id,
                name: attr.name,
                slug: attr.slug,
                terms,
              });
            }
          }
          commit('basic', {
            key: 'attrs',
            value: attrs,
          });
          localStorage.setItem('attrs', JSON.stringify(attrs));
          dispatch('notif', {
            message: 'ویژگی محصولات بروزرسانی شد.',
            color: 'success',
          });
        } catch (error) {
          dispatch('error', error);
        }
        loader.hide();
      }
    },

    // get products list (first page)
    async getProducts({ commit, dispatch }, payload = null) {
      if (payload) {
        commit('basic', {
          key: 'products',
          value: JSON.parse(payload),
        });
      } else {
        const loader = $loading.show({
          color: '#ffffff',
          backgroundColor: '#000000',
          canCancel: true,
        });
        try {
          const res = await window.api.get(`products`, { per_page: 20 });
          commit('basic', {
            key: 'products',
            value: res,
          });
          localStorage.setItem('products', JSON.stringify(res));
        } catch (error) {
          dispatch('error', error);
        }
        loader.hide();
      }
    },

    // show notification
    notif({ commit, state }, payload) {
      commit('notification', payload);
      state.notification.show = true;
      setTimeout(() => (state.notification.show = false), 15000);
    },

    // handle error message (log and notif error)
    error({ dispatch }, err) {
      window.log(err);
      if (err.response) {
        dispatch('notif', {
          message:
            'خطایی رخ داده است! ' +
            err.response.status +
            ': ' +
            err.response.data.message,
          color: 'danger',
        });
      } else {
        dispatch('notif', {
          message: 'خطایی رخ داده است! ' + err.toString(),
          color: 'danger',
        });
      }
    },
  },
});
