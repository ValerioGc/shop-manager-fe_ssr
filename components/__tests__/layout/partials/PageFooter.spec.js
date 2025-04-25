import { describe, it, beforeEach, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { global_store } from '@/stores/global_store';
import PageFooter from '@/components/layout/partials/PageFooter.vue';
import SocialLink from '@/components/layout/layout_elements/SocialLink.vue';

describe('PageFooter.vue', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = global_store();
    store.language = 'ita'; 
  });

  it('renders correctly', () => {
    const wrapper = mount(PageFooter);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the correct follow text in Italian', () => {
    const wrapper = mount(PageFooter);
    expect(wrapper.find('p').text()).toBe('Seguici su');
  });

  it('renders the correct follow text in English', async () => {
    const store = global_store();
    store.language = 'eng';
    const wrapper = mount(PageFooter);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('p').text()).toBe('Follow us');
  });

  it('renders SocialLink component', () => {
    const wrapper = mount(PageFooter);
    expect(wrapper.findComponent(SocialLink).exists()).toBe(true);
  });

  it('renders the correct signature text', () => {
    const wrapper = mount(PageFooter);
    const currentYear = new Date().getFullYear();
    expect(wrapper.find('.signature').text().replace(/\s+/g, ' ')).toContain(`© ${currentYear} - shop-name.com`);
  });

  it('renders the correct tooltip in Italian', () => {
    const wrapper = mount(PageFooter);
    const tooltipText = "Tutte le immagini, i loghi e i marchi registrati appartengono ai legittimi proprietari. È vietato riprodurre il contenuto di questo sito senza autorizzazione.";
    expect(wrapper.find('.signature').attributes('title')).toBe(tooltipText);
  });

  it('renders the correct tooltip in English', async () => {
    const store = global_store();
    store.language = 'eng';
    const wrapper = mount(PageFooter);
    await wrapper.vm.$nextTick();
    const tooltipText = "All images, logos and registered trademarks belong to their legitimate owners. Reproducing the content of this site without permission is prohibited.";
    expect(wrapper.find('.signature').attributes('title')).toBe(tooltipText);
  });
});
