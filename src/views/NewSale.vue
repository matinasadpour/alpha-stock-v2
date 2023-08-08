<script setup>
import { ref } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
import NewSale from '@/components/NewSale.vue';

const titleStack = ref(['فروشگاه', 'ثبت خرید جدید']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <new-sale />
</template>
