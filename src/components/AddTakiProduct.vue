<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useLoading } from 'vue-loading-overlay';
import {
  mdiBallot,
  mdiBarcodeScan,
  mdiNumeric,
  mdiCurrencyUsd,
  mdiFolderMultipleImage,
} from '@mdi/js';
import CardComponent from '@/components/CardComponent.vue';
import Field from '@/components/Field.vue';
import Control from '@/components/Control.vue';
import Divider from '@/components/Divider.vue';
import JbButton from '@/components/JbButton.vue';
import JbButtons from '@/components/JbButtons.vue';
import FilePicker from '@/components/FilePicker.vue';

const $loading = useLoading();

const store = useStore();

const productAttributes = computed(() => store.state.attrs);

const canSubmit = ref(true);

const form = reactive({
  name: '',
  barcode: '',
  quantity: null,
  price: null,
  attributes: {},
  images: [],
});

watch(
  () => form.images,
  () => {
    if (form.images.length) {
      canSubmit.value = false;
    } else {
      canSubmit.value = true;
    }
  }
);

const clear = () => {
  form.name = '';
  form.barcode = '';
  form.quantity = null;
  form.price = null;
  form.attributes = {};
  form.images = [];
  window.scrollTo(0, 0);
};

const submit = async () => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });
  const product = {
    name: form.name,
    regular_price: form.price.toString(),
    sku: form.barcode,
    images: form.images.map((x) => ({ src: x.src })),
    stock_quantity: form.quantity,
    manage_stock: true,
    attributes: [],
    type: 'simple',
    status: 'draft',
  };
  for (const attr in form.attributes) {
    if (!form.attributes[attr]) continue;
    product.attributes.push({
      id: productAttributes.value.find((e) => e.slug === attr).id,
      options: [form.attributes[attr].name],
      visible: true,
    });
  }
  try {
    await window.api.post('products', product);
    clear();
    store.dispatch('notif', {
      message: 'محصول با موفقیت اضافه شد.',
      color: 'success',
    });
  } catch (error) {
    window.log(error);
    if (error.response) {
      store.dispatch('notif', {
        message: error.response.data.code + ' | ' + error.response.data.code,
        color: 'danger',
      });
    }
  }
  loader.hide();
};
</script>

<template>
  <card-component
    title="محصول ساده"
    :icon="mdiBallot"
    form
    :headerIcon="false"
    @submit="submit"
  >
    <field label="نام محصول">
      <control v-model="form.name" placeholder="نام محصول" required />
    </field>
    <field label="بارکد">
      <control
        v-model="form.barcode"
        placeholder="بارکد"
        :icon="mdiBarcodeScan"
        required
        @keydown.enter.prevent
      />
    </field>
    <field label="تعداد و قیمت">
      <control
        v-model="form.quantity"
        type="number"
        :icon="mdiNumeric"
        placeholder="تعداد"
        required
      />
      <control
        v-model="form.price"
        type="number"
        :icon="mdiCurrencyUsd"
        placeholder="قیمت"
        required
      />
    </field>
    <divider />
    <field label="ویژگی‌های محصول">
      <table>
        <thead>
          <tr>
            <th>ویژگی</th>
            <th>مقدار</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(attr, index) in productAttributes"
            :key="attr.slug"
            :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
          >
            <td data-label="ویژگی">
              {{ attr.name }}
            </td>
            <td data-label="مقدار">
              <control
                v-model="form.attributes[attr.slug]"
                :options="attr.terms"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </field>
    <divider />
    <field label="تصاویر محصول">
      <file-picker
        class="justify-center"
        v-model="form.images"
        :multiple="true"
        label="انتخاب تصاویر"
        :icon="mdiFolderMultipleImage"
        :can-submit="canSubmit"
        @uploaded="() => (canSubmit = true)"
      />
    </field>
    <divider />
    <jb-buttons>
      <jb-button
        type="submit"
        color="success"
        label="ثبت"
        :disabled="!canSubmit"
      />
      <jb-button @click="clear()" color="warning" outline label="پاک کردن" />
    </jb-buttons>
  </card-component>
</template>
