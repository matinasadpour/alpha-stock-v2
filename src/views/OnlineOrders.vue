<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { mdiCloudPrint, mdiRefreshCircle } from '@mdi/js';
import TitleBar from '@/components/TitleBar.vue';
import OnlineOrdersTable from '@/components/OnlineOrdersTable.vue';
import MainSection from '@/components/MainSection.vue';
import CardComponent from '@/components/CardComponent.vue';

const $router = useRouter();

const $store = useStore();

const refresh = async () => {
  await $store.dispatch('getOnlineOrders');
  $router.go();
};

const titleStack = ref(['وب سایت', 'سفارش های آنلاین']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <card-component
      class="mb-6"
      title="سفارش‌های آنلاین"
      :icon="mdiCloudPrint"
      :headerIcon="mdiRefreshCircle"
      has-table
      @header-icon-click="refresh"
    >
      <online-orders-table />
    </card-component>
  </main-section>
</template>
