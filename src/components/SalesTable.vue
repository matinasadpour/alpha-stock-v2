<script setup>
import { computed, ref, onBeforeMount, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useLoading } from 'vue-loading-overlay';
import {
  mdiEye,
  mdiChevronRight,
  mdiChevronLeft,
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiPrinter,
} from '@mdi/js';
import Level from '@/components/Level.vue';
import JbButtons from '@/components/JbButtons.vue';
import JbButton from '@/components/JbButton.vue';
import ModalBox from '@/components/ModalBox.vue';

const $router = useRouter();

const $store = useStore();

const $loading = useLoading();

const data = ref(window.db.get(1));

const lightBorderStyle = computed(() => $store.state.lightBorderStyle);

const darkMode = computed(() => $store.state.darkMode);

const currentPage = ref(1);

const isModalActive = ref(false);

let objToPrint = {};

watch(currentPage, async () => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });
  data.value = window.db.get(currentPage);
  window.scrollTo(0, 0);
  loader.hide();
});

const numPages = computed(() => Math.ceil(data.value.size / 20));

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

const print = async () => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });
  console.log(objToPrint);
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
            <span>${new Date(objToPrint.date).toLocaleDateString('fa')}</span>
          </div>
          <div class="info">
            <p>ساعت: </p>
            <span>${new Date(objToPrint.date).toLocaleTimeString('fa')}</span>
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
        data: '../img/logo1.png',
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
  />

  <table>
    <thead>
      <tr>
        <th>شماره خرید</th>
        <th>قیمت کل</th>
        <th>تخفیف</th>
        <th>جمع کل</th>
        <th>تعداد محصول</th>
        <th>توضیح</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-if="!data.items.length">
        <td colspan="8" class="text-center">موردی وجود ندارد!</td>
      </tr>
      <tr v-for="item in data.items" :key="item.order">
        <td>{{ item.order }}</td>
        <td>{{ showPrice(+item.total.price) }} تومان</td>
        <td v-if="item.total.offer">%{{ item.total.offer }}</td>
        <td v-else></td>
        <td v-if="item.total.offer">
          {{
            showPrice(
              +item.total.price - (+item.total.price * item.total.offer) / 100
            )
          }}
          تومان
        </td>
        <td v-else>{{ showPrice(+item.total.price) }} تومان</td>
        <td>{{ item.total.count }}</td>
        <td>{{ item.total.description }}</td>
        <td class="actions-cell">
          <jb-buttons type="justify-start lg:justify-end" no-wrap>
            <!-- <jb-button
              color="info"
              :icon="mdiEye"
              small
              @click="isModalActive = true"
            /> -->
            <jb-button
              color="white"
              :icon="mdiPrinter"
              small
              @click="
                objToPrint = item;
                isModalActive = true;
              "
            />
          </jb-buttons>
        </td>
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
          :disabled="currentPage == numPages"
        />
        <jb-button
          :icon="mdiChevronDoubleLeft"
          small
          :outline="darkMode"
          @click="currentPage = numPages"
          :disabled="currentPage == numPages"
        />
      </jb-buttons>
      <small>صفحه {{ currentPage }} از {{ numPages }}</small>
      <small>تعداد کل خریدها {{ data.size }}</small>
    </level>
  </div>
</template>
