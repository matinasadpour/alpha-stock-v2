import {
  mdiDesktopMac,
  mdiPlus,
  mdiPencil,
  mdiFormatListBulletedType,
  mdiBasketPlus,
  mdiClipboardTextClock,
  mdiCloudPrint,
} from '@mdi/js';

export default [
  [
    {
      to: '/dashboard',
      label: 'داشبورد',
      icon: mdiDesktopMac,
    },
  ],
  'محصولات',
  [
    {
      to: '/addProduct',
      label: 'اضافه کردن محصول',
      icon: mdiPlus,
    },
    {
      to: '/editProduct',
      label: 'ویرایش محصول',
      icon: mdiPencil,
    },
    {
      to: '/products',
      label: 'لیست محصولات',
      icon: mdiFormatListBulletedType,
    },
  ],
  'فروشگاه',
  [
    {
      to: '/newSale',
      label: 'ثبت خرید جدید',
      icon: mdiBasketPlus,
    },
    {
      to: '/sales',
      label: 'تاریخچه خریدها',
      icon: mdiClipboardTextClock,
    },
  ],
  'وب سایت',
  [
    {
      to: '/onlineOrders',
      label: 'سفارش‌های آنلاین',
      icon: mdiCloudPrint,
    },
  ],
];
