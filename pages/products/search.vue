<script setup lang="ts">

  import { ref, watch, onMounted, useRoute } from '#imports';
  import { global_store } from '@/stores/global_store';

  const route = useRoute();
  const store = global_store();

  const products = ref<any[]>([]);
  const listSize = ref<number>(0);
  const isLoading = ref<boolean>(false);

  // ************ Pagination ************
  const page = ref<number>(parseInt(route.query.page as string) || 1);
  const perPage = ref<number>(store.config?.pagination.homeProductPagePagination || 8);

  /**
  * Search products
  * @returns {Promise<void>}
  */
  const searchProducts = async (): Promise<void> => {
    isLoading.value = true;
    const query = route.query.text as string;
    const url: string = `/search/products?query=${encodeURIComponent(query || '')}&page=${page.value}&limit=${perPage.value}&order_by=created_at&order=asc&lang=${store.language}`;

    if (store.cached.search.last_query !== query || listSize.value === 0) {
      store.cached.search._pages = {};
      store.cached.search.total = 0;
      store.cached.search.last_query = query;
    }

    // Check if the data for the current page is already in session cache
    if (store.cached.search._pages[page.value]) {
      products.value = store.cached.search._pages[page.value];
      listSize.value = store.cached.search.total;
      isLoading.value = false;
      return;
    }

    try {
      const res = await store.apiDispatcher(url, 'search');
      products.value = res.data;
      listSize.value = res.total;

      // Save to cache if the number of cached pages is less than 7
      const cachedPages = store.cached.search._pages;
      if (Object.keys(cachedPages).length < 7) {
        cachedPages[page.value] = res.data;
        store.cached.search.total = res.total;
      }

      isLoading.value = false;
      if (store.console_debug) 
        console.table(products.value);
    } catch (error: any) {
      isLoading.value = false;
    }
  };

  watch(
    () => route.query.page as string,
    (newPage) => {
      const pageStr: string = newPage || '1';
      page.value = parseInt(pageStr) || 1;
      searchProducts();
    }
  );

  onMounted(() => {
    searchProducts();
  });

</script>

<template>
  <div class="search_result_container" id="search_view">

    <div>
        <!-- Section Title -->
        <SectionTitle>
          <h1>{{ store.language === 'ita' ?  store.config?.titles.searchPageTitle.ita + ' \'' + route.query.text + '\'' : store.config?.titles.searchPageTitle.eng + ' \'' + route.query.text + '\'' }}</h1>
        </SectionTitle>

        <hr />
    </div>

  <!-- Search Results -->
    <KeepAlive>
      <ProductList :isLoading="isLoading" :pagination="perPage" :listSize="listSize" :products="products" />
    </KeepAlive>

  </div>
</template>

<style lang="scss" scoped>

  .search_result_container {
    padding: 3rem 2rem;
    margin: 0 auto 2rem auto;
    
    @media screen and (min-width: 992px){
      width: 90%;
    }

    @media screen and (min-width: 1200px){
      width: 85%;
    }
    
    @media screen and (min-width: 1400px){
      width: 80%;
    }

    .section-title {
      text-align: center;
      padding-bottom: 1rem;
    }
  }

</style>
