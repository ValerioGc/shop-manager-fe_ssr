<script setup lang="ts">

  import { ref, onBeforeMount } from '#imports';
  import { global_store } from './stores/global_store';

  const store = global_store();

  /**
  * Fetch new shows
  */
  async function getContactsBar(): Promise<void> {
    if (typeof window !== 'undefined') {
      if (store.quick_contacts_list && store.quick_contacts_list.length > 0) {
        store.api_contact_status = 'success';
        return;
      }

      const cachedContacts = sessionStorage.getItem('quick_contacts_list');
      if (cachedContacts) {
        try {
          const parsed = JSON.parse(cachedContacts);
          if (parsed && parsed.length > 0) {
            store.quick_contacts_list = parsed;
            store.api_contact_status = 'success';
            return;
          }
        } catch (e) {
          console.error('Error parsing quick_contacts_list from sessionStorage', e);
        }
      }

      store.api_contact_status = 'loading';
      try {
        const res = await store.apiDispatcher('/contact/specific', 'specific');
        if (res && res.data) {
          const filtered = res.data.filter((contact: any) => {
            return contact.image_url && contact.image_url !== '';
          });

          store.quick_contacts_list = filtered;
          if (filtered.length > 0) {
            store.api_contact_status = 'success';
            sessionStorage.setItem('quick_contacts_list', JSON.stringify(filtered));
          } else {
            store.api_contact_status = 'error';
          }
        }
      } catch (error: any) {
        console.error('Error fetching contacts:', error);
        store.quick_contacts_list = [];
        store.api_contact_status = 'error';
      }
    }
  }

  /**
  * Check the language settings from localStorage and update document language.
  */
  async function checkLanguageSettings(): Promise<void> {
    if (store.language === null) {
      store.language = 'ita';
      document.documentElement.lang = "it";
    } else {
      const langCode = store.language === 'ita' ? "it" : "en";
      document.documentElement.lang = langCode;
    }
  }

  // ********** Website Status **********
  const isConfigLoading = ref < boolean > (true);
  const maintenance = ref < boolean > (false);

  onBeforeMount(async () => {
    try {
      await store.loadConfig();
      if (store.config === null) {
        maintenance.value = true;
      }
      isConfigLoading.value = false;
    } catch (err: any) {
      maintenance.value = true;
      isConfigLoading.value = false;
      console.error(err);
    }
    
    if (!maintenance.value) {
      await checkLanguageSettings();
      getContactsBar();
    }
  });

</script>

<template>

  <LoadingComponent v-if="isConfigLoading" />

  <MaintenanceMessage v-else-if="maintenance" />

  <MainLayout v-else>
    <NuxtPage class="page" />
  </MainLayout>

</template>