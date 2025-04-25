// composables/useConfig.ts

import { ref, onMounted } from '#imports';
import type { FEConfig } from '@/types/FEConfig';

export function useConfig() {
    const config = ref<FEConfig | null>(null)
    const error = ref<string | null>(null)

    async function loadConfig(): Promise<void> {
        if (typeof window !== 'undefined') {
            const storedConfig = sessionStorage.getItem('fe_config');
            console.log('Stored config', storedConfig);
            if (storedConfig) {
                try {
                    config.value = JSON.parse(storedConfig);
                    return;
                } catch (e) {
                    console.error('Error parsing stored config', e);
                }
            }
        }

        try {
            const res = await fetch('/api/config')
            if (!res.ok) {
                error.value = `HTTP error! status: ${res.status}`
                return
            }
            const data: FEConfig = await res.json()
            config.value = data
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('fe_config', JSON.stringify(data))
            }
        } catch (e: any) {
            error.value = e.message || 'Unknown error'
        }
    }

    onMounted(() => {
        loadConfig()
    })

    return { config, error, loadConfig }
}
