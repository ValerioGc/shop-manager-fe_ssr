<script setup lang="ts">

interface Props {
    mode: string;
}

const props = defineProps < Props > ();


</script>

<template>

    <div class="text_placeholder" v-if="props.mode === 'lg'"
        aria-relevant="additions text" aria-busy="true" aria-live="polite" aria-atomic="true"></div>
    <div class="text_placeholder md" v-if="props.mode === 'md'" 
        aria-relevant="additions text" aria-busy="true" aria-live="polite" aria-atomic="true"></div>
    <div class="text_placeholder sm " v-else-if="props.mode === 'sm'" 
        aria-relevant="additions text" aria-busy="true" aria-live="polite" aria-atomic="true"></div>
    <div class="text_placeholder xs " v-else-if="props.mode === 'xs'" 
        aria-relevant="additions text" aria-busy="true" aria-live="polite" aria-atomic="true"></div>
    <div class="text_placeholder btn " v-else-if="props.mode === 'btn'" 
        aria-relevant="additions text" aria-busy="true" aria-live="polite" aria-atomic="true"></div>
    <div class="text_placeholder block " v-else-if="props.mode === 'block'" 
        aria-relevant="additions text" aria-busy="true" aria-live="polite" aria-atomic="true"></div>
    <div class="box wave" v-else-if="props.mode === 'box'"></div>

</template>

<style lang="scss" scoped>

    .text_placeholder {
        margin: .25rem 0;
        display: block;
        min-height: 1.1em;
        border-radius: 5px;
        cursor: wait;
        opacity: 0.75;  
        background-color: #9b9b9b;
        width: 100%;
        mask-image: linear-gradient(130deg, #000 55%, #000000cc 75%, #000 95%);
        mask-size: 200% 100%;
        animation: wave 2s linear infinite;

        &.btn {
            width: 2rem;
            display: inline-block;
            background-color: #656565;
        }

        &.block {
            width: 5rem;
        }

        &.sm {
            width: 50%;
            min-height: 1.1em;
        }

        &.md {
            width: 75%;
        }

        &.xs {
            width: 25%;
        }
    }

    .box {
        z-index:var(--z_2); 
        background-color: rgb(145, 145, 145);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        animation: glow 2s ease-in-out infinite;
    }

    // ********** ANIMATIONS **********
    .wave {
        mask-image: linear-gradient(140deg, #000 55%, rgba(0, 0, 0, 0.8) 75%, #000 95%);
        mask-size: 200% 100%;
        animation: wave 2s linear infinite;
    }

    @keyframes glow {
        50% {
            opacity: 0.2;
        }
    }

    @keyframes wave {
        100% {
            -webkit-mask-position: -200% 0%;
            mask-position: -200% 0%;
        }
    }

</style>