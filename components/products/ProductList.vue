<script setup lang="ts">

  import { computed, useRoute, useRouter } from '#imports';
  import type { ProductList } from '~/types/entity/ProductList';
  import { global_store } from '@/stores/global_store';

  interface Props {
    products: ProductList[];
    pagination: number;
    listSize: number;
    isLoading: boolean;
  }

  const store = global_store();

  const props = defineProps<Props>();

  const route = useRoute();
  const router = useRouter();

  const updateCurrentPage = (newPage: number): void => {
    router.push({ query: { ...route.query, page: newPage.toString() } });
  }

  const productItems = computed<ProductList[]>(() => {
    return props.products.length > 0 ? props.products : [];
  })

</script>

<template>
  <div class="product_container" :aria-busy="props.isLoading">
    <transition name="fade" v-if="props.isLoading || (!props.isLoading && productItems.length > 0)">
      <ul class="cards">
        <ProductCard
          v-for="(product, index) in productItems"
          :key="index"
          :product="product"
          :link="'/products/' + product.id"
        />
      </ul>
    </transition>

    <ResultsPlaceholder :refresh="false" v-if="store.api_status === 'empty'" />
    
    <div v-if="props.listSize > props.pagination">
      <CommonPager :list-size="props.listSize" :per-page="props.pagination" @update:currentPage="updateCurrentPage" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .product_container {
    margin-top: 0.25rem;

    .cards {
      display: flex;
      justify-content: start;
      flex-wrap: wrap;
      list-style: none;

      margin: 0;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
