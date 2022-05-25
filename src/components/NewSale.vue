<script setup>
import { ref, watch, onBeforeMount, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useLoading } from 'vue-loading-overlay';
import { mdiTrashCan, mdiBasket } from '@mdi/js';
import MainSection from '@/components/MainSection.vue';
import CardComponent from '@/components/CardComponent.vue';
import JbButtons from '@/components/JbButtons.vue';
import JbButton from '@/components/JbButton.vue';
import Level from '@/components/Level.vue';
import ModalBox from '@/components/ModalBox.vue';

const $router = useRouter();

const $store = useStore();

const $loading = useLoading();

const items = ref([]);

const total = ref({});

const isModalActive = ref(false);

let barcode = '';

let objToPrint = {};

const addItem = async (sku) => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });
  try {
    let res = await window.api.get('products', { sku });
    if (res.data.length) {
      let exist = items.value.find((e) => e.sku === sku);
      if (exist) {
        if (exist.count + 1 <= exist.stock_quantity) {
          exist.count++;
        } else {
          $store.dispatch('notif', {
            message: 'حداکثر موجودی محصول',
            color: 'warning',
          });
        }
      } else {
        if (res.data[0].stock_quantity !== 0) {
          items.value.push({
            id: res.data[0].id,
            parent_id: res.data[0].parent_id,
            sku: res.data[0].sku,
            name: res.data[0].name,
            price: res.data[0].price,
            stock_quantity: res.data[0].stock_quantity,
            images: res.data[0].images,
            count: 1,
          });
        } else {
          $store.dispatch('notif', {
            message: 'اتمام موجودی محصول',
            color: 'warning',
          });
        }
      }
    } else {
      $store.dispatch('notif', {
        message: 'محصولی یافت نشد',
        color: 'danger',
      });
    }
  } catch (error) {
    $store.dispatch('error', error);
  }
  loader.hide();
};

const scannerEvent = async (e) => {
  if (e.key === 'Enter') {
    if (barcode.startsWith('prod-') || barcode.startsWith('حقخی-')) {
      if (barcode.startsWith('حقخی-')) barcode.replace('حقخی-', 'prod-');
      await addItem(barcode);
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
    barcode = '';
  } else {
    barcode += e.key;
  }
};

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

const checkCount = (sku) => {
  const item = items.value.find((item) => item.sku === sku);
  if (item.count > item.stock_quantity) {
    item.count = item.stock_quantity;
  } else if (item.count < 1) {
    item.count = 1;
  }
};

const checkOffer = () => {
  if (total.value.offer > 100) total.value.offer = 100;
  else if (total.value.offer < 0) total.value.offer = 0;
};

const clear = () => {
  total.value = {};
  if (items.value.length) {
    items.value = [];
  }
};

onBeforeMount(() => {
  document.addEventListener('keydown', scannerEvent);
});

onUnmounted(() => {
  document.removeEventListener('keydown', scannerEvent);
});

watch(
  items,
  () => {
    if (!items.value.length) clear();
    else {
      total.value.price = 0;
      total.value.count = 0;
      for (const item of items.value) {
        total.value.price += +item.price * item.count;
        total.value.count += item.count;
      }
    }
  },
  { deep: true }
);

const print = async () => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          direction: rtl;
          font-size: 12px;
          margin: 0;
        }

        table,
        td,
        th {
          border: 1px solid black;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
        }

        #footer>tbody>tr>td {
          border: 2px solid black;
        }

        .padd {
          padding: 7px 0 7px 0;
        }

        .header {
          background-color: black;
          color: white;
        }

        .header>tr>* {
          border-color: white;
        }

        .info {
          text-align: center;
          width: 33.33%;
          padding: 2mm;
        }

        .info>p {
          display: inline;
        }
      </style>
    </head>

    <body>
      <h1 style="text-align: center; margin:1mm;">فروشگاه آلفا استوک</h1>
      <p style="text-align: center; margin:1mm;">عرضه کننده محصولات اروپایی</p>
      <div style="border: 1px solid black; border-radius: 10px;">
        <div style="width: 100%; text-align: center; border-bottom: 1px dotted black;">
          <p style="font-size: 16px; margin: 0;">رسید خرید</p>
        </div>
        <div style="width: 100%; display: flex;">
          <div class="info">
            <p>شماره فاکتور: </p>
            <span>${objToPrint.order}</span>
          </div>
          <div class="info">
            <p>تاریخ: </p>
            <span>${objToPrint.date.toLocaleDateString('fa')}</span>
          </div>
          <div class="info">
            <p>ساعت: </p>
            <span>${objToPrint.date.toLocaleTimeString('fa')}</span>
          </div>

        </div>
        <table>
          <thead style="border: 2px solid black;" class="header">
            <tr>
              <th rowspan="2" style="width:5%;">ردیف</th>
              <th rowspan="2" style="width:50%">محصول</th>
              <th rowspan="2" style="width:5%;"><span style="transform:rotate(90.0deg);">تعداد</span></th>
              <th class="padd">قیمت</th>
            </tr>
            <tr>
              <th class="padd">قیمت کل</th>
            </tr>
          </thead>
          <tbody>`;
  for (const [i, item] of objToPrint.items.entries()) {
    html += `
            <tr>
              <td rowspan="2">${showPrice(i + 1)}</th>
              <td rowspan="2">${item.name}</th>
              <td rowspan="2">${showPrice(item.count)}</th>
              <td class="padd">
              ${showPrice(+item.price)} تومان
              </td>
            </tr>
            <tr>
              <td class="padd">
              ${showPrice(item.count * +item.price)} تومان
              </td>
            </tr>`;
  }
  html += `
          </tbody>
        </table>
        <table id="footer" style="margin-top: 5mm;">
          <tbody>
            <tr>
              <td>تعداد کالا</td>
              <td>${showPrice(objToPrint.total.count)}</td>
            </tr>
            <tr>
              <td>تخفیف</td>
              <td>
              ${
                objToPrint.total.offer
                  ? showPrice(
                      (objToPrint.total.price * objToPrint.total.offer) / 100
                    ) + ' تومان'
                  : '-'
              }
              </td>
            </tr>
            <tr>
              <td>جمع کل</td>
              <td style="background-color: black; color: white;">
              ${showPrice(
                objToPrint.total.price -
                  (objToPrint.total.price * objToPrint.total.offer) / 100
              )} تومان
              </td>
            </tr>
          </tbody>
        </table>
        <div style="width: 100%; text-align: center;">
          <p style="margin:1mm;">آدرس: سردشت، بازارچه گلزار، طبقه آخر</p>
          <p style="margin:1mm;">تلفن: 09143447851 - 09149245916 - 09149245816</p>
          <p style="margin:1mm;">www.Alpha-Stock.com</p>
        </div>
      </div>
    </body>
    </html>`;

  try {
    await window.qz.websocket.connect();
    const config = qz.configs.create('POS-80C', { scaleContent: 'true' });
    await window.qz.print(config, [
      `\x1B\x61\x31`, // center align
      {
        type: 'raw',
        format: 'image',
        flavor: 'file',
        data: './img/print.png',
        options: {
          language: 'ESCPOS',
          dotDensity: 'double',
        },
      },
    ]);
    await window.qz.print(config, [
      {
        type: 'html',
        format: 'plain',
        data: html,
      },
    ]);
  } catch (error) {
    $store.dispatch('error', error);
  }
  if (window.qz.websocket.isActive()) await window.qz.websocket.disconnect();
  loader.hide();
  $router.push('/dashboard');
};

const submit = async () => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });
  const arrs = {};
  for (const item of items.value) {
    if (item.parent_id === 0) {
      if (!arrs['p0']) arrs['p0'] = [];
      arrs['p0'].push({
        id: item.id,
        stock_quantity: item.stock_quantity - item.count,
      });
    } else {
      if (!arrs[`p${item.parent_id}`]) arrs[`p${item.parent_id}`] = [];
      arrs[`p${item.parent_id}`].push({
        id: item.id,
        stock_quantity: item.stock_quantity - item.count,
      });
    }
  }
  try {
    for (const arr in arrs) {
      if (+arr.substring(1))
        await window.api.post(
          `products/${+arr.substring(1)}/variations/batch`,
          { update: arrs[arr] }
        );
      else await window.api.post('products/batch', { update: arrs[arr] });
    }
    objToPrint = window.db.save(items.value, total.value);
    isModalActive.value = true;
  } catch (error) {
    $store.dispatch('error', error);
  }
  loader.hide();
};
</script>

<template>
  <modal-box
    v-if="isModalActive"
    v-model="isModalActive"
    large-title="آیا فاکتور خرید چاپ شود؟"
    has-cancel
    buttonLabel="بله"
    @confirm="print"
    @cancel="$router.push('/dashboard')"
  />

  <main-section>
    <card-component
      class="mb-6"
      title="خرید"
      :icon="mdiBasket"
      has-table
      :headerIcon="false"
    >
      <table>
        <thead>
          <tr>
            <th>ردیف</th>
            <th>تصویر</th>
            <th>محصول</th>
            <th>قیمت واحد</th>
            <th>تعداد</th>
            <th>قیمت کل</th>
            <th>بارکد</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-if="!items.length">
            <td colspan="8" class="text-center">موردی وجود ندارد!</td>
          </tr>
          <tr v-for="(item, index) in items" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>
              <img
                v-if="item.images.length"
                :src="item.images[0].src"
                height="75"
                width="75"
                loading="lazy"
              />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ showPrice(item.price) }} تومان</td>
            <td>
              <input
                class="px-3 py-2 w-20 bg-transparent focus:ring focus:outline-none border-gray-700 rounded dark:placeholder-gray-400"
                v-model="item.count"
                type="number"
                min="1"
                :max="item.stock_quantity"
                :onchange="checkCount(item.sku)"
              />
            </td>
            <td>{{ showPrice(item.price * item.count) }} تومان</td>
            <td>{{ item.sku }}</td>
            <td class="actions-cell">
              <jb-buttons type="justify-start lg:justify-end" no-wrap>
                <jb-button
                  color="danger"
                  :icon="mdiTrashCan"
                  small
                  @click="items.splice(index, 1)"
                />
              </jb-buttons>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="items.length">
          <td colspan="8">
            <table>
              <tbody>
                <tr>
                  <td>محصولات</td>
                  <td>{{ items.length }}</td>
                </tr>
                <tr>
                  <td>تعداد کل</td>
                  <td>{{ total.count }}</td>
                </tr>
                <tr>
                  <td>قیمت کل</td>
                  <td>{{ showPrice(total.price) }} تومان</td>
                </tr>
                <tr>
                  <td>تخفیف</td>
                  <td>
                    <input
                      type="number"
                      v-model="total.offer"
                      placeholder="0"
                      class="px-3 py-2 w-20 bg-transparent focus:ring focus:outline-none border-gray-700 rounded dark:placeholder-gray-400"
                      min="0"
                      max="100"
                      :onchange="checkOffer()"
                    />
                    <p
                      v-if="total.offer"
                      class="mt-1 line-through decoration-red-500 decoration-2"
                    >
                      {{ showPrice((total.price * total.offer) / 100) }} تومان
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>جمع کل</td>
                  <td v-if="total.offer">
                    {{
                      showPrice(total.price - (total.price * total.offer) / 100)
                    }}
                    تومان
                  </td>
                  <td v-else>{{ showPrice(total.price) }} تومان</td>
                </tr>
                <tr>
                  <td>توضیحات</td>
                  <td>
                    <input
                      type="text"
                      v-model="total.description"
                      placeholder="توضیحات خرید"
                      class="px-3 py-2 w-full bg-transparent focus:ring focus:outline-none border-gray-700 rounded dark:placeholder-gray-400"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tfoot>
      </table>
      <div
        :class="lightBorderStyle"
        class="p-3 lg:px-6 border-t dark:border-gray-800"
      >
        <level>
          <jb-buttons>
            <jb-button
              @click="submit"
              color="success"
              label="ثبت"
              :disabled="!items.length"
            />
            <jb-button
              @click="clear()"
              color="warning"
              outline
              label="پاک کردن"
            />
          </jb-buttons>
        </level>
      </div>
    </card-component>
  </main-section>
</template>
