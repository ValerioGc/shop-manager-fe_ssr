<script setup lang="ts">

import { global_store } from '@/stores/global_store';
import { nextTick, onBeforeMount, ref, useRoute} from '#imports';

const route = useRoute();

import chevron_down from '@/assets/icons/chevron-down.svg';
import chevron_up from '@/assets/icons/chevron-up.svg';


const store = global_store();

// ***** Faq API Call *****
async function getFaqs(): Promise<void> {
    try {
        const faq = await store.apiDispatcher('/faq', 'faqs');
        console.log(faq.data);
        store.cached.faqs = faq.data;
        if (store.debug) console.table(store.cached.faqs);
    } catch (error: any) {
        store.cached.faqs = [];
        console.error('Error fetching FAQs:', error);
    }
}

// ***** Accordion Management *****
const expanded = ref < number[] > ([]);

/**
 * Show/Hide dropdown
 * @param id - indice del dropdown
 */
function showQ(id: number): void {
    if (expanded.value.includes(id)) {
        expanded.value = expanded.value.filter((el) => el !== id);
    } else {
        expanded.value = [id];
    }
}

onBeforeMount((): void => {
    if (store.cached.faqs.length === 0) {
        if (store.debug) console.log('Fetching Faqs, no cache found');
        store.cached.faqs = [{}, {}, {}, {}, {}, {}, {}, {}];
        getFaqs();
    }

    /**
     * Incremental delay management for animations
     * 0.1s delay per ogni elemento (0.1s * indice)
     */
    nextTick((): void => {
        store.cached.faqs.forEach((item: any, index: number) => {
            const element = document.getElementById('accordion_item_' + index);
            if (element) {
                element.style.animationDelay = `${index * 0.1}s`;
            }
        });
    });
});
</script>

<template>
    <div class="faq_wrapper">
        <div class="faq_list_container">

            <!-- Page Title -->
            <SectionTitle>
                <h1>
                    {{ store.language === 'ita' ? store.config?.titles.faqPageTitle.ita :
                        store.config?.titles.faqPageTitle.eng}}
                </h1>
            </SectionTitle>

            <ul v-if="store.api_statuses.faqs === 'success' || store.api_statuses.faqs === 'loading'"
                class="accordion_custom">
                <!-- Accordion item -->
                <li v-for="(q, index) in store.cached.faqs" class="faq_item drop-in" :key="'accordion_item_' + index"
                    :id="'accordion_item_' + index">
                    <div class="faq_button_container">
                        <button type="button" class="faq_button" :disabled="!q.label_ita || !q.label_eng"
                            @click.prevent="showQ(index)">
                            <!-- Question -->
                            <span v-if="q.label_ita || q.label_eng" class="question scale_in_left"
                                v-html="store.language === 'ita' ? q.label_ita : q.label_eng"></span>
                            <!-- Placeholder -->
                            <CommonPlaceholder v-else mode="md" />

                            <div v-if="q.label_ita || q.label_eng">
                                <img :src="!expanded.includes(index) ? chevron_down : chevron_up" alt="chevron icon"
                                    class="icon" loading="lazy" />
                            </div>

                            <!-- Placeholder -->
                            <CommonPlaceholder v-else class="btn_placeholder" mode="btn" />
                        </button>
                    </div>

                    <!-- Dropdown -->
                    <div class="collapsed_drop" :class="{ 'show': expanded.includes(index) }">
                        <div class="faq_body" v-html="store.language === 'ita' ? q.answer_ita : q.answer_eng"></div>
                    </div>
                </li>
            </ul>
            <!-- Error Message -->
            <ResultsPlaceholder v-if="store.api_statuses.faqs !== 'loading' && !store.cached.faqs?.length" />
        </div>
    </div>
</template>

<style lang="scss" scoped>

    .faq_wrapper {
        margin-bottom: 1.75rem !important;

        @media (min-width: 420px) {
            padding: 0 0.5rem 1rem;
            margin: auto;
            width: 80%;
        }

        @media (min-width: 768px) {
            padding: 0 1rem 1rem;
            width: 75%;
        }

        @media (min-width: 920px) {
            width: 70%;
        }

        @media (min-width: 1024px) {
            padding: 0 2rem 2rem;
            width: 60%;
        }

        @media (min-width: 1600px) {
            padding: 0 2.5rem 2.5rem;
            width: 50%;
        }

        .faq_list_container {
            width: 100% !important;

            @media (min-width: 768px) {
                padding: 0 1rem;
            }

            h1 {
                margin-bottom: 1.75rem;
                text-align: center;
            }

            .accordion_custom {
                list-style: none;
                padding: 0;
                margin: 0;
            }
        }

        .placeholder {
            background-color: #939292;
        }

        // Faq Accordion
        .faq_item {
            cursor: pointer;
            background-color: #fcfcfd;
            margin: .75rem;
            font-size: .9rem;
            box-shadow: 0 0 10rem -5px #00000026;

            // ***** Animation *****
            opacity: 0;
            transform: translateY(-100%);

            &:hover {
                filter: opacity(0.85);
                box-shadow: 0 0 2rem -20px #9a7979;
            }

            .faq_button_container {
                margin-bottom: 0;

                img {
                    width: 1.5rem;
                    height: 1.5rem;
                    filter: invert(0.35);
                }

                .faq_button {
                    position: relative;

                    @extend %fx_between_center;
                    gap: .75rem;
                    @extend %full_width;

                    padding: 1.25rem;
                    font-size: 1rem;
                    color: #212529;
                    text-align: left;
                    background-color: #cfe2ff;
                    border: 0.15px solid lightgray;
                    overflow-anchor: none;
                    border-radius: var(--border_radius);

                    .question {
                        font-weight: bold;
                        color: #052a64;
                        text-shadow: 0 0 2px -1px rgba(80, 79, 79, 0.81);
                    }
                }

                .btn_placeholder {
                    width: 2rem;
                    height: 1.25rem;
                }
            }
        }

        // ******** Dropdown faq body ********
        .collapsed_drop {
            .faq_body {
                border: 0.1px solid lightgray;
                border-top: 0;
                padding: 1rem 1.25rem;
            }

            &:not(.show) {
                display: none;
            }

            &.show .faq_item {
                border-radius: 0 !important;
            }
        }
    }

    // ***** Animations *****
    .scale_in_left {
        animation: scale-in-left 0.3s ease-in-out both;
    }

    .drop-in {
        animation: dropIn 0.6s ease-out forwards;
    }

    .drop-in-reverse {
        animation: dropIn 0.5s ease reverse;
    }

    @keyframes scale-in-left {
        0% {
            transform: scaleX(0);
            transform-origin: 0 0;
            opacity: 1;
        }

        100% {
            transform: scaleX(1);
            transform-origin: 0 0;
            opacity: 1;
        }
    }

    @keyframes dropIn {
        from {
            opacity: 0;
            transform: translateY(-100%);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

</style>
