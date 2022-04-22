import { createRouter, createWebHashHistory } from 'vue-router';
import Root from '@/views/Root.vue';
import Dashboard from '@/views/Dashboard.vue';

const routes = [
  {
    meta: {
      title: 'Root',
    },
    path: '/',
    name: 'root',
    component: Root,
  },
  {
    meta: {
      title: 'Dashboard',
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    meta: {
      title: 'Style',
      fullScreen: true,
    },
    path: '/style',
    name: 'style',
    component: () => import('@/views/Style.vue'),
  },
  {
    meta: {
      title: 'Add Product',
    },
    path: '/addProduct',
    name: 'addProduct',
    component: () => import('@/views/AddProduct.vue'),
  },
  {
    meta: {
      title: 'Edit Product',
    },
    path: '/editProduct',
    name: 'editProduct',
    component: () => import('@/views/EditProduct.vue'),
  },
  {
    meta: {
      title: 'Products',
    },
    path: '/products',
    name: 'products',
    component: () => import('@/views/Products.vue'),
  },
  {
    meta: {
      title: 'New Sale',
    },
    path: '/newSale',
    name: 'newSale',
    component: () => import('@/views/NewSale.vue'),
  },
  {
    meta: {
      title: 'Sales',
    },
    path: '/sales',
    name: 'sales',
    component: () => import('@/views/Sales.vue'),
  },
  {
    meta: {
      title: 'Online Orders',
    },
    path: '/onlineOrders',
    name: 'onlineOrders',
    component: () => import('@/views/OnlineOrders.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
