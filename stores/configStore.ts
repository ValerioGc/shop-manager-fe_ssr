// stores/configStore.ts

import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import type { FEConfig } from '@/types/FEConfig';

export const useConfigStore = defineStore('configStore', () => {
    const config = ref<FEConfig | null>(null);
    const error = ref<string | null>(null);

    async function loadConfig(): Promise<void> {
        if (typeof window !== 'undefined') {
            const storedConfig = sessionStorage.getItem('fe_config');
            // console.log('Stored config', storedConfig);
            if (storedConfig) {
                try {
                    config.value = JSON.parse(storedConfig);
                    console.log('Loaded config from session storage');
                    return;
                } catch (e) {
                    console.error('Error parsing stored config', e);
                }
            }
        }

        try {
            console.log('Loading config from API');
            const res = await fetch('/api/config');
            if (!res.ok) {
                error.value = `HTTP error! status: ${res.status}`;
                return;
            }
            const data: FEConfig = await res.json();
            config.value = data;
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('fe_config', JSON.stringify(data));
            }
        } catch (e: any) {
            error.value = e.message || 'Unknown error';
            console.error('Failed to load config', e);
        }
    }

    onMounted(() => {
        loadConfig();
    });

    return { config, error, loadConfig };
});
