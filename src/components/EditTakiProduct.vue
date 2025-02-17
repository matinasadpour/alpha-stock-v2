<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
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

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
});

const $router = useRouter();

const $store = useStore();

const $loading = useLoading();

const productAttributes = computed(() => $store.state.attrs);

const canSubmit = ref(true);

const form = reactive({
  id: props.product.id,
  name: props.product.name,
  barcode: props.product.sku,
  quantity: props.product.stock_quantity,
  price: props.product.regular_price,
  attributes: {},
  images: props.product.images,
});

for (const attr of props.product.attributes) {
  form.attributes[
    productAttributes.value.find((atttr) => atttr.name === attr.name).slug
  ] = productAttributes.value
    .find((atttr) => atttr.name === attr.name)
    .terms.find((term) => term.name === attr.options[0]);
}

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
    id: form.id,
    name: form.name,
    regular_price: form.price.toString(),
    sku: form.barcode,
    images: form.images.map((x) => ({ src: x.src })),
    stock_quantity: form.quantity,
    attributes: [],
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
    await window.api.put(`products/${form.id}`, product);
    $store.dispatch('notif', {
      message: 'محصول با موفقیت تغییر کرد.',
      color: 'success',
    });
  } catch (error) {
    $store.dispatch('error', error);
  }
  loader.hide();
  $router.push('/dashboard');
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
