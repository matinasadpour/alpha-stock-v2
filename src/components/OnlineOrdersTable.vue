<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useLoading } from 'vue-loading-overlay';
import {
  mdiEye,
  mdiPencil,
  mdiChevronRight,
  mdiChevronLeft,
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiTrashCan,
} from '@mdi/js';
import ModalBox from '@/components/ModalBox.vue';
import Level from '@/components/Level.vue';
import JbButtons from '@/components/JbButtons.vue';
import JbButton from '@/components/JbButton.vue';

const $router = useRouter();

const $store = useStore();

const $loading = useLoading();

const data = ref($store.state.onlineOrders);

const items = computed(() => data.value.data);

const lightBorderStyle = computed(() => $store.state.lightBorderStyle);

const darkMode = computed(() => $store.state.darkMode);

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const currentPage = ref(1);

watch(currentPage, async () => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });
  data.value = await window.api.get(`orders`, {
    per_page: 20,
    page: currentPage.value,
  });
  window.scrollTo(0, 0);
  loader.hide();
});

const numPages = computed(() => data.value.headers['x-wp-totalpages']);

const showPrice = (num) => {
  let str = num.toString().split('.');
  str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  if (str[1]) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  let string = str.join('.');
  let id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return string.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
};
</script>

<template>
  <modal-box v-model="isModalActive" title="Sample modal">
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </modal-box>

  <modal-box
    v-if="isModalDangerActive"
    v-model="isModalDangerActive"
    large-title="حذف کردن محصول"
    button="danger"
    has-cancel
    buttonLabel="بله"
    @confirm="deleteProduct"
    @cancel="deletedProduct = null"
  >
    <p>
      آیا می خواهید محصول
      <b>{{ deletedProduct.name }} (ID:{{ deletedProduct.id }})</b> را حذف کنید؟
    </p>
  </modal-box>

  <table>
    <thead>
      <tr>
        <th>شماره سفارش</th>
        <th>هزینه پرداخت شده</th>
        <th>وضعیت</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-if="!items.length">
        <td colspan="4" class="text-center">موردی وجود ندارد!</td>
      </tr>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ showPrice(item.total) }} تومان</td>
        <td>{{ item.status }}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
    <level>
      <jb-buttons>
        <jb-button
          :icon="mdiChevronDoubleRight"
          small
          :outline="darkMode"
          @click="currentPage = 1"
          :disabled="currentPage === 1"
        />
        <jb-button
          :icon="mdiChevronRight"
          small
          :outline="darkMode"
          @click="--currentPage"
          :disabled="currentPage === 1"
        />
        <jb-button :label="currentPage" small />
        <jb-button
          :icon="mdiChevronLeft"
          small
          :outline="darkMode"
          @click="++currentPage"
          :disabled="currentPage == data.headers['x-wp-totalpages']"
        />
        <jb-button
          :icon="mdiChevronDoubleLeft"
          small
          :outline="darkMode"
          @click="currentPage = data.headers['x-wp-totalpages']"
          :disabled="currentPage == data.headers['x-wp-totalpages']"
        />
      </jb-buttons>
      <small>صفحه {{ currentPage }} از {{ numPages }}</small>
      <small>تعداد کل سفارشات {{ data.headers['x-wp-total'] }}</small>
    </level>
  </div>
</template>
