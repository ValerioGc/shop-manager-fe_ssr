// middleware/resetBreadcrumbs.global.ts

import { defineNuxtRouteMiddleware } from '#imports';
import { product_settings_store } from '@/stores/product_settings_store';


/**
  * Reset breadcrumbs when navigating to products page
*/
export default defineNuxtRouteMiddleware((to, from) => {
    if (to.name === 'products' && from.name !== 'products' && from.name !== 'product-details') {
        const productStore = product_settings_store();
        productStore.resetBreadcrumbs();
    }
});
