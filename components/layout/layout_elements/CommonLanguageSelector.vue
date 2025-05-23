<script setup lang="ts">

import { ref } from '#imports';
import { global_store } from '@/stores/global_store';

import ita_flag from '@/assets/flags/ita.svg';
import eng_flag from '@/assets/flags/eng.svg';

import chevron_down from '@/assets/icons/caret-down.svg';
import chevron_up from '@/assets/icons/caret-up.svg';

const store = global_store();

const emit = defineEmits<{ (e: 'closeMenu'): void }>();
const showDropdown = ref<boolean>(false);

/**
 * Show or hide dropdown element
 * @param shw - Show or hide dropdown
 * @returns {void}
 */
function showDropdownElement(shw: boolean): void {
  showDropdown.value = shw;
}

/**
 * Change website language
 * @return {void}
 */
function changeLanguage(): void {
  store.changeLanguage();
  showDropdown.value = false;
  emit('closeMenu');
}

/**
 * Set the flag of the selected language
 * @param element - The element to set
 * @return {string} - The flag image path
 */
function setSelectFlag(element: number): string {
  if (element === 0) {
    return store.language === 'ita' ? ita_flag : eng_flag;
  } else {
    return store.language === 'ita' ? eng_flag : ita_flag;
  }
}

function setSelectDropdownIcon(): string {
  return !showDropdown.value ? chevron_down : chevron_up;
}

</script>

<template>
  <ul id="language_selector" :class="showDropdown ? 'reverse_column' : 'column'" role="menu" aria-label="Language selector"
    @mouseenter="showDropdownElement(true)"
    @mouseleave="showDropdownElement(false)"
  >

    <li>
      <a class="current_flag" href="#">
        <img :src="setSelectFlag(0)" :alt="store.language === 'ita'?'ITA':'ENG'" class="flag" loading="lazy"  />

        <img :src="setSelectDropdownIcon()" alt="dropdown menu status icon" loading="lazy" class="caret" />
      </a>
    </li>

    <transition
      enter-active-class="slide-enter-active"
      leave-active-class="slide-leave-active"
      enter-from-class="slide-enter-from"
      enter-to-class="slide-enter-to"
      leave-from-class="slide-leave-from"
      leave-to-class="slide-leave-to"
    >
      <li v-show="showDropdown">
        <a @click="changeLanguage" class="change_lang" href="#">
          <img :src="setSelectFlag(1)" :alt="store.language === 'ita'?'ENG':'ITA'" loading="lazy" class="flag"  />
        </a>
      </li>
    </transition>
  </ul>
</template>

<style lang="scss" scoped>

  #language_selector {
    display: flex;
    padding: .35rem 0;
    margin-left: .15rem;
    background: #fcfcfc;

    position: relative;
    border: 0.1px solid rgba(146, 146, 146, 0.521);
    box-shadow: 0 0.5rem 0.8rem rgba(0, 0, 0, 0.15);
    border-radius: var(--border_radius);
    
    align-items: stretch;
    margin: 0; 

    &.reverse_column {
      flex-direction: column-reverse;
    }

    &.column {
      flex-direction: column;
    }

    &:hover {
      animation: open_dropdown 0.5s ease;
    }

    .current_flag {
      display: flex;
      border-radius: 6px;
      align-items: center;
    }

    .flag,
    .caret{
      cursor: pointer;
      transition: all 0.5s ease;
    }
    .caret{
      margin: 0 .25rem 0 0;
      width: 1.3rem;
      height: 0.6rem;
      filter: opacity(0.75);
    }

    .flag {
      width: 35px;
      height: 21px;
      
      &:first-child {
        margin: 0.30rem 0.25rem;
      }
    }

    li:last-child {
      position: absolute;
      top: 97%;
      width: 101.5%;
      transform: translate(-0.5px, -2px);
    }

    .change_lang {
      display: block;
      align-items: center;
      @include border_radius('bottom', var(--border_radius));
      border: 0.1px solid rgba(146, 146, 146, 0.805);
      border-top: 0;
      background: #fcfcfc;
    }
  }

  // ********** Transition **********
  .slide-enter-active, .slide-leave-active {
    transition: max-height 0.5s ease, opacity 0.5s ease;
  }

  .slide-enter-from, .slide-leave-to {
    max-height: 0;
    opacity: 0;
  }

  .slide-enter-to, .slide-leave-from {
    max-height: 100px;
    opacity: 1;
  }

  @keyframes open_dropdown {
    100% {
      border-bottom: 0;
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
  }

</style>
