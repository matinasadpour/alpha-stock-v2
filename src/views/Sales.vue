<script setup>
import { ref } from 'vue';
import TitleBar from '@/components/TitleBar.vue';

const titleStack = ref(['فروشگاه', 'تاریخچه خریدها']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
</template>
