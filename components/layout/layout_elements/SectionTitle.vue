<template>
  <div class="section-title-container">
    <slot class="section-title"></slot>
  </div>
</template>

<style lang="scss">

  .section-title-container > h1,
  .section-title-container > h2,
  .section-title-container > h3,
  .section-title-container > h4,
  .section-title-container > h5 {
    color: var(--secondary-color);
    font-weight: bold;
    padding: 1rem 0 1rem 0;
  }

</style>
