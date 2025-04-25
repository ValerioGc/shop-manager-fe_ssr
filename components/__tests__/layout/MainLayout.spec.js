    import { mount } from '@vue/test-utils';
    import { describe, it, expect } from 'vitest';
    import MainLayout from '@/components/layout/MainLayout.vue';

    describe('MainLayout.vue', () => {
        it('renders correctly', () => {
            const wrapper = mount(MainLayout);
            expect(wrapper.exists()).toBe(true);
        });

        it('renders PageHeader and PageFooter components', () => {
            const wrapper = mount(MainLayout);
            expect(wrapper.findComponent({ name: 'PageHeader' }).exists()).toBe(true);
            expect(wrapper.findComponent({ name: 'PageFooter' }).exists()).toBe(true);
        })

        it('renders slot content', () => {
            const wrapper = mount(MainLayout, {
                slots: {
                default: '<div class="slot-content">Slot Content</div>'
                }
            });
            expect(wrapper.find('.slot-content').exists()).toBe(true);
            expect(wrapper.find('.slot-content').text()).toBe('Slot Content');
        })
    })
