<script setup lang="ts">

  import { ref, watch, onMounted, useRoute, useRouter } from '#imports';
  import { global_store } from '@/stores/global_store';
  import { product_settings_store } from '@/stores/product_settings_store';
  import type { Product } from '~/types/entity/Product';

  const router = useRouter();
  const route = useRoute();
  const store = global_store();
  const productStore = product_settings_store();

  // ******************* Page Title *********************
  const category_label = ref<string>(store.language === 'ita' ? 'Ultimi Arrivi' : 'Latest arrivals');

  /**
  * Update the page title based on the last expanded breadcrumb
  */
  const updateTitle = (): void => {
    const lastBreadcrumb = productStore.breadcrumbs.slice().reverse().find((b: any) => b.expandedIndex !== null);
    if (lastBreadcrumb) {
      category_label.value = store.language === 'ita' ? lastBreadcrumb.label_ita : lastBreadcrumb.label_eng;
    } else {
      category_label.value = store.language === 'ita' ? 'Ultimi Arrivi' : 'Latest Arrivals';
    }
  };

  /**
  * Fetch categories from the API
  */
  async function getCategories(): Promise<void> {
    try {
      const response = await store.apiDispatcher('/category/' + store.language, 'categories');
      store.cached.categories = response.data;
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
    } finally {
      updateTitle();
    }
  }

  // ******************** Reactive Data ************************
  const products = ref<Product[] | {}>([{},{},{},{},{},{},{},{},{},{}]);
  const listSize = ref<number>(0);
  const page = ref<number>(parseInt(route.query.page as string) || 1);
  const perPage = ref<number>(store.config?.pagination.productPagePagination || 10);
  const categoryId = ref<number | null>(null);
  const isLoading = ref<boolean>(false);
  const isChangingFilter = ref<boolean>(false);

  const fetchProducts = async (caller: string): Promise<void> => {
    if (isLoading.value) return;

    isLoading.value = true;
    console.log('fetchProducts caller: ', caller);

    let sub: string = "";
    console.log('categoryId.value: ', categoryId.value);
    if (!categoryId.value) {
      sub = "&in_evidence=true";
    } else {
      sub = `&category_id=${categoryId.value}`;
    }
    const url: string = `/product/filter/paginate?page=${page.value}&limit=${perPage.value}&order_by=created_at&order=asc${sub}`;
    console.log('calling: '+ url);
    try {
      const prd = await store.apiDispatcher(url, 'products');
      products.value = prd.data;
      listSize.value = prd.total;
    } catch (error: any) {
      console.error("Error fetching products:", error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
    * Change page and scroll to top 
    * @param page - The page number to navigate to
  */
  watch(() => store.language,
    (newLang: string) => {
      updateTitle();
      getCategories();
    }
  );


  /**
    * Change page and scroll to top 
    * @param page - The page number to navigate to
  */
  watch(() => route.query.page as string | undefined,
    (newPage: string | undefined) => {
      const newPageValue: number = parseInt(newPage || '1') || 1;
      if (!isChangingFilter.value && newPageValue !== page.value) {
        page.value = newPageValue;
        fetchProducts("page");
      }
    }
  );

  watch(
    () => productStore.breadcrumbs,
    (newBreadcrumbs) => {
      if (isLoading.value) return;

      const lastBreadcrumb = newBreadcrumbs.slice().reverse().find((b: any) => b.expandedIndex !== null);
      const newCategoryId = lastBreadcrumb ? lastBreadcrumb.expandedIndex : null;

      if (newCategoryId !== categoryId.value) {
        isChangingFilter.value = true;
        categoryId.value = newCategoryId;
        page.value = 1;
        router.replace({ query: { ...route.query, page: 1 } });

        updateTitle();
        fetchProducts("breadcrumbs").finally(() => {
          isChangingFilter.value = false;
        });
      }
    },
    { deep: true }
  );

  onMounted(() => {
    if (productStore.breadcrumbs.length) updateTitle();

    if (!store.cached.categories.length) getCategories();
    
    const lastBreadcrumb = productStore.breadcrumbs.slice().reverse().find((b: any) => b.expandedIndex !== null);
    categoryId.value = lastBreadcrumb ? lastBreadcrumb.expandedIndex : null;
    fetchProducts("onMounted");
    window.addEventListener('resize', () => {  });
  });

</script>


<template>
  <div class="main">

    <!-- Aside Filter -->
    <AsideFilter :mode="'desktop'" />

    <div class="main_section">
      <AsideFilter :mode="'mobile'" />
      <BreadcrumbComponent />

      <SectionTitle>
        <h1 class="section-title">{{ category_label }}</h1>
      </SectionTitle>

      <div class="total_number">
          <span class="text" v-if="store.language === 'ita'">Totale prodotti:</span>
          <span class="text" v-else>Total products:</span>
          
          <CommonPlaceholder mode="btn" v-if="store.api_statuses.products === 'loading' || isLoading" />
          
          <span v-else-if="listSize > 0" class="size">
            {{ listSize}}
          </span>
          
          <span v-else>0</span>
      </div>

      <hr />

      <!-- Product List -->
      <KeepAlive>
        <ProductList :isLoading="isLoading" :pagination="perPage" :listSize="listSize" :products="products" />
      </KeepAlive>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .main {
    padding: 0 1rem;
    margin-bottom: 2rem;

    @media screen and (min-width: 992px) {
      @include flexmin(space-between, flex-start, null, null, .75rem);
    }

    .main_section{
      width: 100%;

      .total_number {
        @extend %full_width;
        text-align: center;
        @extend %fx_center;
        
        .text {
          font-style: italic;
          padding-right: .5rem;
        }
        .size {
                    font-weight: bold;
        }
      }

      h1 {
        font-weight: bold;
        text-align: center;
        font-size: 1.75rem;

        @media screen and (min-width: 580px) {
          font-size: 2rem;
        }
        @media screen and (min-width: 768px) {
          font-size: 2.4rem;
        }
      }
    }
  }

</style>
