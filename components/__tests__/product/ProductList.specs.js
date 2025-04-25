import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import YourComponent from '@/path/to/YourComponent.vue'
import NoResultsPlaceholder from '@/path/to/ResultsPlaceholder.vue'
import productCard from '@/path/to/ProductCard.vue'
import Pager from '@/path/to/commonPager.vue'

vi.mock('@/stores/global_store.js', () => ({
  global_store: () => ({
    api_status: 'loading'
  })
}))

vi.mock('@/router/index.js', () => ({
  push: vi.fn()
}))

describe('YourComponent.vue', () => {
  let wrapper

  const props = {
    list: [
      { name: 'Product 1', date: '04/05/24 - 20/05/2024', id: 1 },
      { name: 'Product 2', date: '04/05/24 - 20/05/2024', id: 2 }
    ]
  }

  beforeEach(() => {
    wrapper = mount(YourComponent, {
      props,
      global: {
        components: {
          NoResultsPlaceholder,
          productCard,
          Pager
        }
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays NoResultsPlaceholder when list is empty', () => {
    wrapper.setProps({ list: [] })
    expect(wrapper.findComponent(NoResultsPlaceholder).exists()).toBe(true)
  })

  it('displays the correct number of product cards', () => {
    expect(wrapper.findAllComponents(productCard).length).toBe(2)
  })

  it('displays loading placeholders when api_status is loading', () => {
    const items = wrapper.findAll('.card.shadow')
    expect(items.length).toBe(10)
  })

  it('renders Pager component with correct props', () => {
    const pager = wrapper.findComponent(Pager)
    expect(pager.exists()).toBe(true)
    expect(pager.props('listSize')).toBe(props.list.length)
    expect(pager.props('perPage')).toBe(5)
  })
})
