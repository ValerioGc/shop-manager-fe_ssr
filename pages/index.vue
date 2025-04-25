<script setup lang="ts">

import { useSeoMeta, ref, onMounted, watch,useRoute, useHead, definePageMeta, useServerSeoMeta } from '#imports';
import { global_store } from '@/stores/global_store';
import type { ProductList } from '~/types/entity/ProductList';
import { homeSeoMeta } from '~/meta/homeSeoMeta';

useHead({
        title: 'Shop Name - Home title',
        name: 'Shop Name - Home name',
        titolo: 'Shop Name - Home Ita', 
        meta: [
            { hid: 'ogDescription', name: 'ogDescription', content: 'Shop Name - Home' },
            { hid: 'description', name: 'description', content: 'Shop Name - Home' }, 
            { hid: 'keywords', name: 'keywords', content: 'Shop Name - Home' }, 
        ],
});
useSeoMeta({
  description: () => 'New meta description',
});
const route = useRoute();
const store = global_store();

// *********** Banner management ***********
const imgErr = ref < boolean > (false);
const er = (): void => {
    imgErr.value = true;
};

/**
 * Fetch new shows
 */
async function getNextShows(): Promise<void> {
    try {
        const res = await store.apiDispatcher('/show/new', 'showN');
        store.cached.show_new = res.data;
        if (store.console_debug) console.log('new shows', store.cached.show_new);
    } catch (error: unknown) {
        store.cached.show_new = [];
        if (store.console_debug) console.error('Error fetching new shows', error);
    }
}

// ************ Pagination ************
const products = ref <ProductList[] | {}> ([{},{},{},{},{},{},{},{},{},{}]);
const listSize = ref <number> (0);
const page = ref <number> (parseInt((route.query.page as string) || '1'));
const perPage = ref <number> (store.config?.pagination.homeProductPagePagination || 10);
const isLoading = ref <boolean> (false);

/**
 * Fetch products
 */
const fetchProducts = async (): Promise<void> => {
    isLoading.value = true;
    const url = `/product/filter/paginate?page=${page.value}&limit=${perPage.value}&order_by=created_at&order=asc&in_evidence=true`;

    if (store.cached.latest._pages[page.value]) {
        products.value = store.cached.latest._pages[page.value];
        listSize.value = store.cached.latest.total;
        isLoading.value = false;
        return;
    }

    try {
        const prd = await store.apiDispatcher(url, 'products');
        products.value = prd.data;
        listSize.value = prd.total;

        if (Object.keys(store.cached.latest._pages).length < 7) {
            store.cached.latest._pages[page.value] = prd.data;
            store.cached.latest.total = prd.total;
        }
    } catch (error) {

    } finally {
        isLoading.value = false;
    }
};

/**
 * Update page number
 * @param newPage - The new page number
 */
watch(() => route.query.page, (newPage) => {
        page.value = parseInt(newPage as string) || 1;
        fetchProducts();
    }
);

onMounted(() => {
    if (
        (store.config?.settings.showHomeShowSection && !store.cached.show_new) ||
        (store.cached.show_new && store.cached.show_new.length === 0)
    ) {
        getNextShows();
    }
    fetchProducts();
});

</script>

<template>
    <div class="main_view">
        <!-- Banner -->
        <img v-if="store.config.settings != null && store.config?.settings.showHomeBanner === true && store.config.settings.bannerImg != null && !imgErr"
            :src="store.config.settings.bannerImg" @error="er" alt="banner Shop Name" class="banner-img"
            loading="lazy" 
        />

        <div>
            <!-- Home section -->
            <section class="welcome_section">
                <SectionTitle v-if="store.config?.settings.showHomeTitle">
                    <h1 class="section-title">
                        {{ store.language === 'ita'
                            ? store.config.titles.homeTitleText.ita
                            : store.config.titles.homeTitleText.eng }}
                    </h1>
                </SectionTitle>

                <p class="home_description">
                    {{ store.language === 'ita'
                        ? store.config?.text.homePageDescriptionText.ita
                        : store.config?.text.homePageDescriptionText.eng }}
                </p>
            </section>

            <!-- Latest Product Section -->
            <section class="latest_section" id="latestProd">
                <div class="latest_container">
                    <div class="product_view_head">
                        <SectionTitle>
                            <h2>
                                {{ store.language === 'ita' ? 'Ultimi Arrivi' : 'New Arrivals' }}
                            </h2>
                        </SectionTitle>

                        <NuxtLink class="btn_e btn_primary" to="/products">
                            {{ store.language === 'ita' ? 'Vai ai prodotti' : 'Go to products' }}
                        </NuxtLink>
                    </div>
                </div>

                <hr />

                <ProductList :isLoading="isLoading" :pagination="perPage" :listSize="listSize" :products="products" />
            </section>

            <!-- Show Carousel Section -->
            <section class="show_section" v-if="store.config && store.config.settings.showHomeShowSection">
                <div class="show_container">
                    <div class="product_view_head">
                        <SectionTitle>
                            <h2>
                                {{
                                    store.language === 'ita'
                                        ? 'Prossime Fiere ed Eventi'
                                        : 'Next Shows and events'
                                }}
                            </h2>
                        </SectionTitle>
                        <NuxtLink class="btn_e btn_primary" to="/shows">
                            {{ store.language === 'ita' ? 'Vai alle fiere' : 'Go to shows' }}
                        </NuxtLink>
                    </div>

                    <hr />

                    <ShowCarousel
                        v-if="store.api_statuses.showN === 'loading' || (store.cached.show_new && store.cached.show_new.length > 0)"
                        :items="store.cached.show_new" />
                    <ResultsPlaceholder v-else :refresh="false" :pl_text="store.language === 'ita' ? 'Nessuna fiera in programma' : 'No shows scheduled'" /> 
                </div>
            </section>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.main_view {
    padding-top: 0 !important;

    // reset 
    .btn_e {
        padding: 0.25rem;

        @media screen and (min-width: 768px) {
            padding: 0.35rem 0.5rem;
        }

        @media screen and (min-width: 992px) {
            padding: 0.5rem 0.75rem;
        }
    }

    .section-title {
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
    }

    .banner-img {
        width: 100%;
        max-height: 500px;
        object-fit: cover;
        object-position: center;
        box-shadow: 0 0 6px gray;
    }

    .welcome_section {
        margin: 1rem 0;

        @media screen and (min-width: 768px) {
            width: 75% !important;
            margin: 1rem auto 1.5rem;
        }

        @media screen and (min-width: 920px) {
            width: 60% !important;
            margin: 1.5rem auto 2rem;
        }

        @media screen and (min-width: 1200px) {
            width: 50% !important;
        }

        .home_description {
            font-size: 1.3rem;
            padding: 1.7rem 1rem 1rem;
            line-height: 1.75rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-align: justify;
        }

        h1 {
            font-weight: bold;
            font-size: 1.8rem;
            text-align: center;
            letter-spacing: 1px;

            @media screen and (min-width: 580px) {
                font-size: 2rem;
            }

            @media screen and (min-width: 992px) {
                font-size: 2.5rem !important;
            }

            @media screen and (min-width: 1200px) {
                font-size: 2.75rem !important;
            }
        }
    }

    h2 {
        color: var(--secondary-color);
        padding: 1rem 0;
        font-weight: bold;
        font-size: 1.5rem;
        margin: 0;
        text-align: left;

        @media screen and (min-width: 480px) {
            font-size: 1.65rem;
        }

        @media screen and (min-width: 580px) {
            font-size: 1.75rem;
        }

        @media screen and (min-width: 768px) {
            font-size: 2rem !important;
        }

        @media screen and (min-width: 1200px) {
            font-size: 2.2rem !important;
        }
    }

    .show_section,
    .latest_section {
        padding: 1.5rem 0.5rem;

        @media screen and (min-width: 580px) {
            padding: 1.5rem 0.75rem;
        }

        @media screen and (min-width: 768px) {
            padding: 1.5rem 1rem;
        }

        @media screen and (min-width: 1000px) {
            width: 90% !important;
            margin: 0 auto;
        }

        @media screen and (min-width: 1200px) {
            width: 80% !important;
            margin: 0 auto;
        }

        @media screen and (min-width: 1600px) {
            width: 75% !important;
        }

        .latest_container {
            @extend %fx_between_center;
            @extend %full_width;
            @extend %tx_center;

            padding: 0.25rem;
            margin-bottom: 0;
            padding-bottom: 0;

            @media screen and (min-width: 768px) {
                padding: 0.5rem;
            }

            @media screen and (min-width: 1200px) {
                padding: 0.75rem;
            }

            .btn_e {
                @media screen and (min-width: 768px) {
                    padding: 0.5rem;
                }
            }
        }

        .show_container {
            padding: 0.25rem;
            margin-bottom: 0;
            padding-bottom: 0;

            @media screen and (min-width: 768px) {
                padding: 0.5rem;
            }

            @media screen and (min-width: 1200px) {
                padding: 0.75rem;
            }

            .product_view_head {
                margin-bottom: 1rem;
            }

            hr {
                margin-bottom: 1.25rem;
            }
        }

        .product_view_head {
            @extend %fx_between_center;
            @extend %full_width;
            gap: 0.5rem;

            a {
                font-weight: bold;
                color: #fff !important;
                background-color: #273ba6 !important;

                &:hover {
                    background: fixed #273ba6 !important;
                    opacity: 0.9;
                    box-shadow: 0 0 5px 0 #273ba6;
                }
            }
        }
    }
}
</style>
