<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useLoading } from 'vue-loading-overlay';
import TitleBar from '@/components/TitleBar.vue';
import MainSection from '@/components/MainSection.vue';
import CardComponent from '@/components/CardComponent.vue';
import JbButton from '@/components/JbButton.vue';
import EditTakiProduct from '@/components/EditTakiProduct.vue';
import EditPakiProduct from '@/components/EditPakiProduct.vue';
import Field from '@/components/Field.vue';
import Control from '@/components/Control.vue';

const titleStack = ref(['محصولات', 'ویرایش محصول']);

const $route = useRoute();

const $store = useStore();

const $loading = useLoading();

const item = ref($route.params.item ? JSON.parse($route.params.item) : null);

const searchItem = ref('');

const search = async () => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });
  const res = await window.api.get('products', { sku: searchItem.value });
  if (res.data.length) {
    if (res.data[0].parent_id) {
      const ress = await window.api.get(`products/${res.data[0].parent_id}`);
      item.value = ress.data;
    } else {
      item.value = res.data[0];
    }
  } else {
    $store.dispatch('notif', {
      message: 'محصولی با این بارکد پیدا نشد!',
      color: 'danger',
    });
  }
  loader.hide();
};
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section v-if="item">
    <edit-taki-product v-if="item.type === 'simple'" :product="item" />
    <edit-paki-product v-else :product="item" />
  </main-section>
  <main-section v-else>
    <card-component class="md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl md:mx-auto">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <field label="پیدا کردن محصول با استفاده از بارکد">
          <control
            v-model="searchItem"
            placeholder="بارکد"
            required
            @keydown.enter="search"
          />
        </field>
        <jb-button label="جستجو" outline @click="search" />
      </div>
    </card-component>
  </main-section>
</template>
