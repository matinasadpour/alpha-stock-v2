<script setup>
import { ref } from 'vue';
import TitleBar from '@/components/TitleBar.vue';

const titleStack = ref(['فروشگاه', 'ثبت خرید جدید']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
</template>
