import {
  mdiDesktopMac,
  mdiPlus,
  mdiPencil,
  mdiFormatListBulletedType,
  mdiCartPlus,
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
      to: '/newCart',
      label: 'ثبت سفارش جدید',
      icon: mdiCartPlus,
    },
    {
      to: '/history',
      label: 'تاریخچه سفارشات',
      icon: mdiClipboardTextClock,
    },
  ],
  'وب سایت',
  [
    {
      to: '/sales',
      label: 'سفارش‌های آنلاین',
      icon: mdiCloudPrint,
    },
  ],
];
