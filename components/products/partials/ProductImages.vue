<script setup lang="ts">

  import { onMounted, ref, watch } from '#imports';
  import { global_store } from '@/stores/global_store';

  interface Props {
    initialImages: string[];
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'update:images', payload: { url: string; index: number }): void
    (e: 'open:modal', mainImage: string, thumbnails: string[]): void
  }>();

  const store = global_store();

  const selectedIndex = ref<number>(0);
  const mainImageUrl = ref<string>(
    props.initialImages && props.initialImages.length > 0 ? props.initialImages[0] : ''
  );

  interface Thumbnail {
    id: number
    url: string
  }
  const thumbnails = ref<Thumbnail[]>(
    props.initialImages && props.initialImages.length > 0
      ? props.initialImages.map((url, index) => ({ id: index + 1, url }))
      : []
  );

  function openModal(): void {
    emit('open:modal', mainImageUrl.value, thumbnails.value.map(image => image.url));
  }

  function selectImage(url: string, index: number): void {
    mainImageUrl.value = url;
    selectedIndex.value = index;
    emit('update:images', { url, index });
  }

  watch(
    () => props.initialImages, (newImages: string[]) => {
      mainImageUrl.value = newImages[0];
      thumbnails.value = newImages.map((url, index) => ({ id: index + 1, url }));
      selectedIndex.value = 0;
    },
    { immediate: true }
  )

  onMounted(() => {
    if (props.initialImages && props.initialImages.length > 0) {
      mainImageUrl.value = props.initialImages[0];
      thumbnails.value = props.initialImages.map((url, index) => ({ id: index + 1, url }));
    }
  })

</script>


<template>
  <div class="product_image_viewer" v-if="mainImageUrl && mainImageUrl.length > 0">
    <div class="main_image" @click="openModal">
      <div class="modal_icon_container">
        <img src="@/assets/icons/arrows-fullscreen.svg" alt="Expand fullscreen" class="modal_icon" />
      </div>
      <img :src="mainImageUrl" alt="Main Product Image" :title="store.language === 'ita' ? 'Espandi l\'immagine' :'Expand the picture'" />
    </div>
    <div class="thumbnails" v-if="thumbnails">
      <img v-for="(thumbnail, index) in thumbnails" :key="thumbnail.id" :src="store.mountUrl(thumbnail.url)"
            @click="selectImage(thumbnail.url, index)" :class="{ selected : selectedIndex === index }" alt="Thumbnail" 
            :title="store.language === 'ita' ? 'Cambia immagine' :'Change picture'" 
      />
    </div>
  </div>  
</template>

<style lang="scss" scoped>

  .product_image_viewer {
    position: relative;
    width: 100%;
    min-width: 240px;
    margin: 0 auto!important;
    border: .2px solid #3f3f3fcb;
    border-radius: var(--border_radius);
    background-color: #f5f5f5;
    box-shadow: 0 0 10px -3px #5e5e5ead;
    display: flex;
    align-items: center;
    flex-direction: column;

    @media screen and (min-width: 320px) {
      min-width: 275px;
    }
  
    .main_image {
      @include border_radius('top', var(--border_radius));
      width: 100%;
      height: 200px;
      cursor: pointer;

      @media screen and (min-width: 320px) {
        height: 300px;
      }

      @media screen and (min-width: 768px){
        max-width: 100%;
      }

      .modal_icon_container {
        position:absolute;
        top: 5px;
        right: 5px;
        padding: 0.25rem;
        width: 35px;
        height: 35px;
        z-index: var(--z_2);
        background-color: var(--secondary-color);
        border-radius: var(--border_round);
        box-shadow: 0 0 8px -2px rgb(255, 255, 255);
        cursor: pointer;
        text-align: center;

        &:hover  {
          opacity: 0.7;
        }

        .modal_icon {
          display: block;
          width: 100%;
          padding: 0.25rem;

          align-content: center;
          filter: invert(1);
        }
      }

      img {
        @extend %full_wh;
        @include border_radius('top', var(--border_radius));
        object-fit: contain;
        object-position: center;
        transition: all 0.15s linear;
        &:hover  {
          filter: brightness(0.8);
        }
      }
    }

    .thumbnails {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(105px, 1fr)); // Auto-distribuzione delle thumbnails
      gap: 0.7rem;
      width: 100%;
      padding: 0.5rem;
      border-top: 1px solid rgb(60, 60, 60);
      background-color: #eaeaea;
      @include border_radius('bottom', var(--border_radius));  

      @media screen and (max-width: 370px) {
        justify-content: center; // Centra le thumbnails per schermi piccoli
      }

      img {
        height: 95px;
        width: 100%;
        cursor: pointer;
        object-fit: cover;
        object-position: center;
        border-radius: 4px;
        padding: .05rem;
        transition: all 0.15s linear;
        background-color: var(--secondary-color-light);

        @media screen and (min-width: 300px) {
          height: 105px;
        }

        &:hover {
          filter: brightness(0.75);
        }

        &.selected {
          border-color: var(--secondary-color-light);
        }
      }
    }
  }

</style>
