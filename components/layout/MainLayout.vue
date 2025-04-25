<script setup lang="ts">

import { nextTick, onMounted, onUnmounted, ref } from "#imports";

const isMobile = ref<boolean>(false);
const mobile_navbar_Height = ref<number>(0);
const navbarHeight = ref<number>(0);

// ********** Close Dropdown **********//
const clMod = ref<boolean>(false);
const closeModal = (): void => {
  clMod.value = true;
  setTimeout((): void => {
    clMod.value = false;
  }, 150);
};

const updateScreenType = (): void => {
  isMobile.value = window.innerWidth < 992;
};

const updateMobileNavbarHeight = (): void => {
  const top_nav = document.querySelector('.navbar_mobile') as HTMLElement | null;
  if (top_nav) {
    mobile_navbar_Height.value = top_nav.offsetHeight;
  }
};


const updateDesktopNavbarHeight = (): void => {
  const navbarCollapse = document.querySelector('.header_navbar') as HTMLElement | null;
  if (navbarCollapse) {
    navbarHeight.value = navbarCollapse.offsetHeight;
  }
};

const updateNavbarHeight = (): void => {
  updateScreenType();
  if (isMobile.value) {
    updateMobileNavbarHeight(); 
  } else {
    updateDesktopNavbarHeight();
  }
};

onMounted(() => {
  nextTick(() => {
    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', updateNavbarHeight);
});
</script>

<template>
  <!-- Page overlay -->
  <div id="overlay" @click.prevent="closeModal()"></div>

  <div class="app_container">
    <PageHeader :clMod="clMod" />
    <main>
      <div class="main_container" :style="{ marginTop: isMobile ? mobile_navbar_Height + 'px' : navbarHeight + 'px' }">
        <slot></slot>
      </div>
    </main>
    <PageFooter />
  </div>
</template>

<style lang="scss" scoped>

  #overlay {
    display: none;
    position: fixed;
    overflow: hidden;
    backdrop-filter: blur(3px);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0000008a;
    z-index: var(--z_1);
    transition: all 0.2s linear;
    animation: fade 0.2s;

    @media screen and (min-width: 992px) {
      display: none!important;    
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .app_container {
    margin: auto;
    overflow: hidden;
    min-height: 100vh;

    main,
    .main_container {
      position: relative;
      min-height: 70vh;
      margin-top: 3.5rem; 
    }

    .main_container {
      @media screen and (min-width: 2500px) {
        margin: auto;
        width: 75%;
      }
    }
  }

</style>
