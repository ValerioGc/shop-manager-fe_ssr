

<script setup lang="ts">

import { ref, watch, useRouter } from '#imports';
import { global_store } from '@/stores/global_store';

const store = global_store();
const router = useRouter();

function sanitizeSQL(query: string): string {
  query = query.replace(/'/g, "''")
  query = query.replace(/(--|\/\*|\*\/|#)/g, '')
  const map: Record<string, string> = {
    '\\': '\\\\',
    '"': '\\"',
    '`': '\\`',
    '\x00': '\\x00',
    '\b': '\\b',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\x1a': '\\Z'
  }
  const reg = "/[\x00\b\n\r\t\x1a]/g";
  return query.replace(reg, (match: string): string => map[match] || '');
}

const emit = defineEmits<{ (e: 'closeMenu'): void }>()

let searchInput = ref<string>('')

/**
  * Search products and navigate to search view
  * @returns {void}
  * @emits router.push to '/search/products'
  */
function searchProducts(): void {
  const input = document.querySelector('#search-bar') as HTMLInputElement;
  if (input) 
    input.blur();
  
  router.push({ path: '/products/search', query: { text: sanitizeSQL(searchInput.value) } });
  searchInput.value = '';
  emit('closeMenu');
}

/**
  * Set the title attribute for the search bar
  * @returns {string}
  */
function setTitle(): string | undefined {
  if (!isValid.value)
    return store.language === 'ita' ? 'Inserisci almeno 3 catatteri per cercare' : 'Insert at least 3 characters to search'
  const btn = document.getElementById('search_btn')
  if (!btn || !btn.classList.contains('disabled'))
    return
  else
    return store.language === 'ita' ? 'Immetti del testo per cercare' : 'Insert some text to search'
}

const isValid = ref<boolean>(true)

/**
  * Validate the search input
  * @returns {boolean}
  */
const validate = (): boolean => {
  if (searchInput.value.length > 0 && searchInput.value.length < 3) {
    return false
  }
  if (searchInput.value.length > 50) {
    return false
  }
  return true
}

watch(searchInput, () => {
  isValid.value = validate()
})
</script>


<template>
  <div class="search_bar_container">
    <form class="src_bar" @submit.prevent="searchProducts" :title="setTitle()">
      <input class="form_ctl"
            :class="{'invalid': !isValid}"
            type="search"
            role="searchbox"
            :aria-description="store.language==='ita'?'i risultati verranno visualizzati qui sotto':'search results will appear below'"
            v-model="searchInput"
            id="search-bar"
            :placeholder="store.language === 'ita' ? 'Cerca Prodotti' : 'Search Products'"
            :aria-label="store.language === 'ita' ? 'Cerca Prodotti' : 'Search Products'"
      />
      <button id="search_btn" class="btn_u" type="submit" 
        :class="{ disabled: searchInput === '' || store.api_statuses.search === 'loading' || !isValid }"
        :disabled="searchInput === '' || store.api_statuses.search === 'loading' || !isValid"
        :title="setTitle()"
      >
        <img src="@/assets/icons/search.svg" alt="search icon" class="icon" loading="lazy" />
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>

  .search_bar_container {
    border-radius: var(--border_radius);
    border: 0.1px solid rgba(146, 146, 146, 0.521);
    box-shadow: 0 0.5rem 0.8rem rgba(0, 0, 0, 0.15);

    .src_bar {
      display: flex;
      outline-offset: -2px;

      .btn_u {
        position: relative;
        z-index: var(--z_2);
        margin-left: calc(var(--bs-border-width)* -1);
        @include border_radius('right', var(--border_radius));
        padding: 0.25rem;
        border: 0.1rem solid #d4d4d4c0;
        line-height: 1.5;
        text-align: center;

        &.disabled {
          cursor:not-allowed;
        }

        &:not(.disabled) {
          cursor:pointer;
        }
        &:hover:not(.disabled) {
          background-color: var(--secondary-color);

          img {
            filter: invert(1);
          }
        }

        img {
          width: 1.7rem;
          height: 100%;
        }
      }

      .form_ctl {
        width: 100%;
        display: block;
        padding: 0.375rem 0.75rem;
        border: 0.1rem solid #d4d4d4c0;
        @include border_radius('left', var(--border_radius));
        background-clip: padding-box;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        font-size: 1.15rem;
        
        &:focus, 
        &:active, 
        &:focus-visible {
          border-color: var(--secondary-color);
          border-width: .3px;
          outline: 0;
          box-shadow: 0 0 0 0.15rem #273ba640;

          &.invalid {
            border-color: #a70c0cb3;

            &:focus {
              border-color: #a70c0cb3;
              box-shadow: -1px 0 6px -1px #690909b3;
            }
          }
        }
      }
    }
  }

</style>
