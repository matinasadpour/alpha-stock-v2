<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { mdiClipboardListOutline, mdiRefreshCircle } from '@mdi/js';
import TitleBar from '@/components/TitleBar.vue';
import ProductsTable from '@/components/ProductsTable.vue';
import MainSection from '@/components/MainSection.vue';
import CardComponent from '@/components/CardComponent.vue';

const $router = useRouter();

const $store = useStore();

const refresh = async () => {
  await $store.dispatch('getProducts');
  $router.go();
};

const titleStack = ref(['محصولات', 'لیست محصولات']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <card-component
      class="mb-6"
      title="محصولات"
      :icon="mdiClipboardListOutline"
      :headerIcon="mdiRefreshCircle"
      has-table
      @header-icon-click="refresh"
    >
      <products-table />
    </card-component>
  </main-section>
</template>
