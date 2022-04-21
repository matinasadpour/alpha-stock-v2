<script setup>
import { ref } from 'vue';
import { mdiClipboardListOutline } from '@mdi/js';
import TitleBar from '@/components/TitleBar.vue';
import ProductsTable from '@/components/ProductsTable.vue';
import MainSection from '@/components/MainSection.vue';
import CardComponent from '@/components/CardComponent.vue';

const titleStack = ref(['محصولات', 'لیست محصولات']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <card-component
      class="mb-6"
      title="محصولات"
      :icon="mdiClipboardListOutline"
      :headerIcon="false"
      has-table
    >
      <products-table />
    </card-component>
  </main-section>
</template>
