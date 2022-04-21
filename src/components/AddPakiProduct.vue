<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useLoading } from 'vue-loading-overlay';
import {
  mdiBallot,
  mdiBarcodeScan,
  mdiNumeric,
  mdiCurrencyUsd,
  mdiFolderMultipleImage,
  mdiTrashCan,
} from '@mdi/js';
import CardComponent from '@/components/CardComponent.vue';
import Field from '@/components/Field.vue';
import Control from '@/components/Control.vue';
import Divider from '@/components/Divider.vue';
import JbButton from '@/components/JbButton.vue';
import JbButtons from '@/components/JbButtons.vue';
import CheckboxCell from '@/components/CheckboxCell.vue';
import FilePicker from '@/components/FilePicker.vue';

const $loading = useLoading();

const store = useStore();

const productAttributes = computed(() => store.state.attrs);

const canSubmit = ref(true);

const variationEnable = reactive(new Set());

const form = reactive({
  name: '',
  price: null,
  attributes: {},
  variations: [],
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
  form.price = null;
  form.attributes = {};
  form.variations = [];
  form.images = [];
  window.scrollTo(0, 0);
};

const checked = (e, payload) => {
  if (e) {
    variationEnable.add(payload.slug);
    form.attributes[payload.slug] = null;
  } else {
    variationEnable.delete(payload.slug);
  }
};

const addVariation = () => {
  form.variations.push({ barcode: '', quantity: null, attributes: {} });
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }, 100);
};

const submit = async () => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });
  const product = {
    name: form.name,
    images: form.images.map((x) => ({ src: x.src })),
    attributes: [],
    type: 'variable',
    status: 'draft',
  };
  for (const attr in form.attributes) {
    if (!form.attributes[attr] && !variationEnable.has(attr)) continue;
    product.attributes.push({
      id: productAttributes.value.find((e) => e.slug === attr).id,
      options: variationEnable.has(attr) ? [] : [form.attributes[attr].name],
      visible: true,
      variation: variationEnable.has(attr),
    });
  }
  const varis = [];
  for (const variation of form.variations) {
    const vari = {
      regular_price: form.price.toString(),
      sku: variation.barcode,
      manage_stock: true,
      stock_quantity: variation.quantity,
      attributes: [],
    };
    for (const attr in variation.attributes) {
      if (!variation.attributes[attr]) continue;
      vari.attributes.push({
        id: productAttributes.value.find((e) => e.slug === attr).id,
        option: variation.attributes[attr].name,
      });
      product.attributes
        .find(
          (e) =>
            e.id === productAttributes.value.find((e) => e.slug === attr).id
        )
        .options.push(variation.attributes[attr].name);
    }
    varis.push(vari);
  }

  try {
    const res = await window.api.post('products', product);
    await window.api.post(`products/${res.data.id}/variations/batch`, {
      create: varis,
    });
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
    title="محصول متغییر"
    :icon="mdiBallot"
    form
    :headerIcon="false"
    @submit="submit"
  >
    <field label="نام محصول">
      <control v-model="form.name" placeholder="نام محصول" required />
    </field>
    <field label="قیمت">
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
            <th>استفاده از ویژگی برای متغییر</th>
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
                :disabled="variationEnable.has(attr.slug)"
              />
            </td>
            <checkbox-cell @checked="checked($event, attr)" />
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
    <template v-if="form.variations.length">
      <field label="متغییرها">
        <div
          v-for="(variation, index) in form.variations"
          :key="'var' + index"
          class="p-3 border border-gray-800 dark:border-gray-700 rounded-md mb-7"
        >
          <div class="grid grid-cols-2 gap-3 items-center mb-5">
            <label class="block font-bold italic">متغییر {{ index }}</label>
            <jb-buttons type="justify-start lg:justify-end" no-wrap>
              <jb-button
                color="danger"
                :icon="mdiTrashCan"
                small
                @click="form.variations.splice(index, 1)"
              />
            </jb-buttons>
          </div>
          <field>
            <control
              v-model="variation.barcode"
              placeholder="بارکد"
              :icon="mdiBarcodeScan"
              required
              @keydown.enter.prevent
            />
            <control
              v-model="variation.quantity"
              type="number"
              :icon="mdiNumeric"
              placeholder="تعداد"
              required
            />
          </field>
          <field v-if="variationEnable.size">
            <table>
              <!-- <thead>
                <tr>
                  <th>ویژگی</th>
                  <th>مقدار</th>
                </tr>
              </thead> -->
              <tbody>
                <tr
                  v-for="(attr, indexx) in variationEnable"
                  :key="attr + indexx"
                  :class="[
                    tableTrStyle,
                    index % 2 === 0 ? tableTrOddStyle : '',
                  ]"
                >
                  <td data-label="ویژگی">
                    {{ productAttributes.find((e) => e.slug === attr).name }}
                  </td>
                  <td data-label="مقدار">
                    <control
                      v-model="variation.attributes[attr]"
                      :options="
                        productAttributes.find((e) => e.slug === attr).terms
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </field>
        </div>
      </field>
      <divider />
    </template>
    <jb-buttons>
      <jb-button
        type="submit"
        color="success"
        label="ثبت"
        :disabled="!canSubmit"
      />
      <jb-button
        color="white"
        outline
        label="اضافه کردن متغییر"
        @click="addVariation"
      />
      <jb-button @click="clear()" color="warning" outline label="پاک کردن" />
    </jb-buttons>
  </card-component>
</template>
