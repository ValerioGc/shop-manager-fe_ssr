// middleware/seo.global.ts
import { defineNuxtRouteMiddleware, h, useCookie } from '#imports'
import { faqSeoMeta } from '@/meta/faqSeoMeta'
import { contactSeoMeta } from '~/meta/contactSeoMeta'
import { homeSeoMeta } from '~/meta/homeSeoMeta'
import { productSeoMeta } from '~/meta/product/productSeoMeta'
import { searchSeoMeta } from '~/meta/product/searchSeoMeta'
import { showDetailSeoMeta } from '~/meta/show/showDetailSeoMeta'
import { productDetailSeoMeta } from '~/meta/product/productDetailSeoMeta'
import { showSeoMeta } from '~/meta/show/showSeoMeta'

const metaMapping: Record<string, any> = {
    home: homeSeoMeta,
    faq: faqSeoMeta,
    contacts: contactSeoMeta,
    products: productSeoMeta,
    search: searchSeoMeta,
    productDetail: productDetailSeoMeta,
    show: showSeoMeta,
    showDetail: showDetailSeoMeta,
}

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        const languageCookie = useCookie('language', { default: () => 'ita' })
        const language = languageCookie.value

        let languageMetaTag = document.querySelector('meta[name="language"]')
        if (languageMetaTag) {
            languageMetaTag.setAttribute('content', language === 'eng' ? 'en' : 'it')
        } else {
            languageMetaTag = document.createElement('meta')
            languageMetaTag.setAttribute('name', 'language')
            languageMetaTag.setAttribute('content', language === 'eng' ? 'en' : 'it')
            document.head.appendChild(languageMetaTag)
        }

        const metaData = metaMapping[to.name as string]
        if (metaData) {
            document.title = `${(language === 'eng' ? metaData.title : metaData.titolo)} | Store Name`
            const metaTags = [
                { key: 'description', value: metaData.description, attr: 'name' },
                { key: 'keywords', value: metaData.keywords, attr: 'name' },
                { key: 'og:title', value: metaData.ogTitle, attr: 'property' },
                { key: 'og:description', value: metaData.ogDescription, attr: 'property' },
                { key: 'og:image', value: metaData.ogimage, attr: 'property' },
                { key: 'og:url', value: metaData.ogUrl, attr: 'property' }
            ]
            metaTags.forEach((tag) => {
                const content = typeof tag.value === 'object' ? (tag.value[language] || '') : tag.value
                let element = document.querySelector(`meta[${tag.attr}="${tag.key}"]`)
                if (element) {
                    element.setAttribute('content', content)
                } else {
                    element = document.createElement('meta')
                    element.setAttribute(tag.attr, tag.key)
                    element.setAttribute('content', content)
                    document.head.appendChild(element)
                }
            })
        } else {
            if (to.meta?.title) {
                document.title = `${(language === 'eng' ? to.meta.title : to.meta.titolo)} | Store Name`
            } else if (to.params.name) {
                document.title = `${to.params.name} | Store Name`
            } else {
                document.title = 'Store Name'
            }
        }
    }
})
