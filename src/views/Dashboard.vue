<script setup>
import { ref } from 'vue';
import TitleBar from '@/components/TitleBar.vue';

const titleStack = ref(['داشبورد']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
</template>
