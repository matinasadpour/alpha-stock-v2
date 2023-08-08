<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { sectionBgLogin } from '@/colors.js';
import MainSection from '@/components/MainSection.vue';
import CardComponent from '@/components/CardComponent.vue';

const styles = [
  {
    slug: 'white',
    title: 'White',
  },
  {
    slug: 'basic',
    title: 'Basic',
  },
];

const store = useStore();

store.dispatch('darkMode', false);

const router = useRouter();

const click = (slug) => {
  store.dispatch('setStyle', slug);
  store.dispatch('darkMode', false);
  router.push('/dashboard');
};
</script>

<template>
  <main-section :class="sectionBgLogin" class="min-h-screen ltr">
    <h1
      class="text-4xl md:text-6xl text-center text-white font-bold mt-6 mb-3 md:mt-12 md:mb-6"
    >
      Pick a style&hellip;
    </h1>
    <div class="grid gap-6 grid-cols-1 lg:grid-cols-2 px-6 max-w-6xl mx-auto">
      <card-component
        v-for="style in styles"
        :key="style"
        class="cursor-pointer shadow-2xl"
        rounded="rounded-2xl"
        hoverable
        @click="click(style.slug)"
      >
        <div class="mb-3 md:mb-6">
          <img :src="`./img/${style.slug}.png`" width="955" height="540" />
        </div>

        <h1 class="text-xl md:text-2xl font-black">
          {{ style.title }}
        </h1>
        <h2 class="text-lg md:text-xl">& Dark mode</h2>
      </card-component>
    </div>
  </main-section>
</template>
