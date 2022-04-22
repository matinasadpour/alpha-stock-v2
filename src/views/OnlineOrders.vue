<script setup>
import { ref } from 'vue';
import TitleBar from '@/components/TitleBar.vue';

const titleStack = ref(['وب سایت', 'سفارش های آنلاین']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
</template>
