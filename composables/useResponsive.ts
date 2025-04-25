// composables/useResponsive.ts

import { ref, onMounted, onBeforeUnmount, computed } from '#imports';

export function useResponsive() {
    const width = ref<number>(0);

    function updateWidth() {
        if (typeof window !== 'undefined') 
            width.value = window.innerWidth;
    }

    onMounted(() => {
        updateWidth();
        window.addEventListener('resize', updateWidth);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', updateWidth);
    });

    const isMobile = computed(() => width.value < 992);

    return { width, isMobile };
}
