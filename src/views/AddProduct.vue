<script setup>
import { ref } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
import CheckRadioPicker from '@/components/CheckRadioPicker.vue';
import TitledSection from '@/components/TitledSection.vue';
import MainSection from '@/components/MainSection.vue';
import AddTakiProduct from '@/components/AddTakiProduct.vue';
import AddPakiProduct from '@/components/AddPakiProduct.vue';

const titleStack = ref(['محصولات', 'اضافه کردن محصول']);

const isTaki = ref(true);
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <titled-section custom>
    <h1 class="text-2xl text-gray-500 dark:text-gray-400">نوع محصول</h1>
    <div class="flex items-center justify-center mt-6 ltr">
      <p class="mr-2">محصول متغییر</p>
      <check-radio-picker
        v-model="isTaki"
        type="switch"
        name="product-type"
        :options="{ taki: '' }"
      />
      <p>محصول ساده</p>
    </div>
  </titled-section>
  <main-section>
    <add-taki-product v-if="isTaki" />
    <add-paki-product v-else />
  </main-section>
</template>
