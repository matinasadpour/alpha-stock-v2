<script setup>
import { ref } from 'vue';
import { mdiClipboardTextClock } from '@mdi/js';
import TitleBar from '@/components/TitleBar.vue';
import SalesTable from '@/components/SalesTable.vue';
import MainSection from '@/components/MainSection.vue';
import CardComponent from '@/components/CardComponent.vue';

const titleStack = ref(['فروشگاه', 'تاریخچه خریدها']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <card-component
      class="mb-6"
      title="تاریخچه خریدها"
      :icon="mdiClipboardTextClock"
      has-table
    >
      <sales-table />
    </card-component>
  </main-section>
</template>
