<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import {
  mdiCheckCircleOutline,
  mdiInformationOutline,
  mdiAlertCircle,
} from '@mdi/js';
import menu from '@/menu.js';
import NavBar from '@/components/NavBar.vue';
import AsideMenu from '@/components/AsideMenu.vue';
import Overlay from '@/components/Overlay.vue';
import Notification from '@/components/Notification.vue';
import MainSection from '@/components/MainSection.vue';

const store = useStore();

const isAsideLgActive = computed(() => store.state.isAsideLgActive);

const showNotification = computed(() => store.state.notification.show);

const notificationColor = computed(() => store.state.notification.color);

const notificationMessage = computed(() => store.state.notification.message);

const overlayClick = () => {
  store.dispatch('asideLgToggle', false);
};
</script>

<template>
  <nav-bar />
  <aside-menu :menu="menu" />
  <main-section v-if="showNotification">
    <notification
      :color="notificationColor"
      :icon="
        notificationColor === 'danger'
          ? mdiAlertCircle
          : notificationColor === 'success'
          ? mdiCheckCircleOutline
          : mdiInformationOutline
      "
    >
      {{ notificationMessage }}
    </notification>
  </main-section>
  <router-view />
  <overlay
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
</template>
