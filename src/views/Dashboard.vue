<script setup>
import { ref } from 'vue';
import { mdiBasketPlusOutline, mdiPlus } from '@mdi/js';
import TitleBar from '@/components/TitleBar.vue';
import MainSection from '@/components/MainSection.vue';
import Icon from '@/components/Icon.vue';

const titleStack = ref(['داشبورد']);
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 auto-rows-max">
      <div class="flex flex-col col-span-2 justify-between">
        <router-link to="/newSale">
          <div
            class="w-full bg-gradient-to-tr from-rose-500 to-orange-200 rounded text-center align-middle p-7"
          >
            <h1 class="text-5xl font-semibold leading-tight">
              <icon
                :path="mdiBasketPlusOutline"
                size="52"
                h="h-fit"
                w="w-fit"
              /><br />
              ثبت خرید
            </h1>
          </div>
        </router-link>
      </div>
      <div class="flex flex-col justify-between">
        <router-link to="/addProduct">
          <div
            class="w-full bg-gradient-to-tr from-sky-400 to-sky-200 rounded text-center align-middle p-7"
          >
            <h1 class="text-3xl font-semibold leading-tight">
              <icon :path="mdiPlus" size="52" h="h-fit" w="w-fit" /><br />
              اضافه<br />
              کردن<br />
              محصول
            </h1>
          </div>
        </router-link>
      </div>
    </div>
  </main-section>
</template>
