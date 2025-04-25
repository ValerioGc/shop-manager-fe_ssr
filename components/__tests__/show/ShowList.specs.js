import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import YourComponent from '@/path/to/YourComponent.vue'

vi.mock('@/stores/global_store.js', () => ({
  global_store: () => ({
    api_status: 'loading'
  })
}))

describe('YourComponent.vue', () => {
  let wrapper

  const props = {
    list: [
      { name: 'Fiera 1', date: '04/05/24 - 20/05/2024', id: 1 },
      { name: 'Fiera 2', date: '04/05/24 - 20/05/2024', id: 2 }
    ],
    showDrop: false,
    old: true
  }

  beforeEach(() => {
    wrapper = mount(YourComponent, {
      props
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct number of list items', () => {
    const items = wrapper.findAll('.list-group-item')
    expect(items.length).toBe(5) // 2 from props.list + 3 hardcoded in template
  })

  it('renders the list items with correct text', () => {
    const items = wrapper.findAll('.list-group-item')
    expect(items[0].text()).toContain('Fiera 1')
    expect(items[1].text()).toContain('Fiera 2')
  })

  it('toggles the dropdown visibility', async () => {
    const toggleButton = wrapper.find('a[href="#"]')
    await toggleButton.trigger('click')
    
    const dropdown = wrapper.find('.dropdown0')
    expect(dropdown.classes()).not.toContain('hide')

    await toggleButton.trigger('click')
    expect(dropdown.classes()).toContain('hide')
  })
})
