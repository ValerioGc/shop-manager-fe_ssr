// stores/global_store.ts
import { useRuntimeConfig, useCookie } from '#imports';
import axios from '~/plugin/axios.client';
import { defineStore } from 'pinia';
import { useConfigStore } from './configStore';
import type { FEConfig } from '@/types/FEConfig';

interface ApiStatuses {
    home: string
    categories: string
    products: string
    product_detail: string
    faqs: string
    contacts: string
    search: string
    showO: string
    showN: string
    show: string
    specific: string
}

interface CachedLatest {
    total: number
    _pages: Record<number, any>
}

interface CachedShowOld {
    total: number
    _pages: Record<number, any>
}

interface CachedSearch {
    last_query: string | null
    total: number
    _pages: Record<number, any>
}

interface Cached {
    latest: CachedLatest
    show_new: any[]
    show_old: CachedShowOld
    product_detail: any
    search: CachedSearch
    categories: any[]
    faqs: any[]
    contacts: any[]
}

interface GlobalStoreState {
    routes: { route: string; name: string; label: string }[]
    api_status: string
    api_statuses: ApiStatuses
    _host: string
    _endpoint_prefix: string
    api_contact_status: string
    cached: Cached
    quick_contacts_list: any[]
    language: string
    controllers: Record<string, AbortController>
    fe_config: FEConfig | null,
    console_debug: boolean
}

export const global_store = defineStore('global_store', {
    state: (): GlobalStoreState => {
        const runtimeConfig = useRuntimeConfig()
        const defaultContacts: any[] = []
        let storedContacts: any = null
        if (typeof window !== 'undefined') {
            const tmp = sessionStorage.getItem('quick_contacts_list')
            storedContacts = tmp ? JSON.parse(tmp) : null
        }
        const langCookie = useCookie('language', { default: () => 'ita' })
        const configStore = useConfigStore()

        return {
            routes: [
                { route: '/', name: 'Home', label: 'Home' },
                { route: '/products', name: 'Prodotti', label: 'Products' },
                { route: '/shows', name: 'Fiere', label: 'Shows' },
                { route: '/faq', name: 'FAQ', label: 'FAQ' },
                { route: '/contacts', name: 'Contatti', label: 'Contacts' }
            ],
            api_status: 'success',
            api_statuses: {
                home: 'success',
                categories: 'success',
                products: 'success',
                product_detail: 'success',
                faqs: 'success',
                contacts: 'success',
                search: 'success',
                showO: 'success',
                showN: 'success',
                show: 'success',
                specific: 'success'
            },
            _host: (runtimeConfig.private as { VITE_API_ENDPOINT: string }).VITE_API_ENDPOINT,
            _endpoint_prefix: '/api/public',
            api_contact_status: 'success',
            cached: {
                latest: { total: 0, _pages: {} },
                show_new: [],
                show_old: { total: 0, _pages: {} },
                product_detail: {},
                search: { last_query: null, total: 0, _pages: {} },
                categories: [],
                faqs: [],
                contacts: []
            },
            quick_contacts_list: storedContacts || defaultContacts,
            language: langCookie.value,
            controllers: {},
            fe_config: configStore.config,
            console_debug: true
        }
    },
    getters: {
        getLanguage(state): string {
            return state.language
        },
        config(state): FEConfig | null {
            return state.fe_config
        }
    },
    actions: {
        async loadConfig(): Promise<void> {
            const configStore = useConfigStore()
            await configStore.loadConfig()
            this.fe_config = configStore.config
        },
        changeLanguage(): void {
            const langCookie = useCookie('language', { default: () => 'ita' })
            if (this.language === 'ita') {
                this.language = 'eng'
            } else {
                this.language = 'ita'
            }
            langCookie.value = this.language
            if (typeof window !== 'undefined') {
                document.documentElement.lang = this.language === 'eng' ? 'en' : 'it'
            }
        },
        initializeLanguage(): void {
            const langCookie = useCookie('language', { default: () => 'ita' })
            if (typeof window !== 'undefined' && langCookie.value) {
                this.language = langCookie.value
                document.documentElement.lang = this.language === 'eng' ? 'en' : 'it'
            }
        },
        mountUrl(url: string): string {
            let parsedURL = url.split('/')
            const filename = parsedURL.pop() || ''
            const filenameParts = filename.split('.')
            const fileExtension = filenameParts.pop() || ''
            const fileNameOnly = filenameParts.join('.')
            if (fileExtension.toLowerCase() === 'svg') {
                parsedURL.push(filename)
                return parsedURL.join('/')
            }
            parsedURL.push('thumbnails')
            const newFileName = `${fileNameOnly}_thumb.${fileExtension}`
            parsedURL.push(newFileName)
            return parsedURL.join('/')
        },
        async apiDispatcher(uri: string, callName: keyof ApiStatuses): Promise<any> {
            const url: string = this._host + this._endpoint_prefix + uri
            this.api_status = 'loading'
            this.api_statuses[callName] = 'loading'
            const requestKey = `${callName}:${uri}`
            if (this.controllers[requestKey]) {
                this.controllers[requestKey].abort()
            }
            const controller = new AbortController()
            this.controllers[requestKey] = controller
            try {
                const response = await axios.get(url, { signal: controller.signal })
                this.api_statuses[callName] = 'success'
                this.api_status = 'success'
                let status = await this.manageApiStatus(response, callName)
                return response ? response.data : null
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    this.api_statuses[callName] = 'error'
                    this.api_status = 'error'
                    return { error: error.message }
                }
            }
        },
        async manageApiStatus(response: any, callName: keyof ApiStatuses): Promise<string> {
            let statusMessage = ''
            if (
                response &&
                response.status === 200 &&
                (
                    (Array.isArray(response.data) && response.data.length === 0) ||
                    (response.data &&
                        response.data.data &&
                        Array.isArray(response.data.data) &&
                        response.data.data.length === 0)
                )
            ) {
                this.api_statuses[callName] = 'empty'
                this.api_status = 'empty'
                statusMessage = 'Status: empty'
            } else if (response && response.status === 200) {
                this.api_statuses[callName] = 'success'
                this.api_status = 'success'
                statusMessage = 'Status: success'
            } else {
                this.api_statuses[callName] = 'error'
                this.api_status = 'error'
                statusMessage = response
                    ? `Status: error - Error: ${response.statusText}`
                    : 'Status: error - No response'
            }
            return statusMessage
        },
        saveSessionData(): void {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('quick_contacts_list', JSON.stringify(this.quick_contacts_list))
            }
        },
        loadSessionData(): void {
            if (typeof window !== 'undefined') {
                const stored = sessionStorage.getItem('quick_contacts_list')
                this.quick_contacts_list = stored ? JSON.parse(stored) : [{}, {}, {}, {}]
            }
        },
        async getContactsBar(): Promise<void> {
            if (typeof window !== 'undefined') {
                const cachedContacts = sessionStorage.getItem('quick_contacts_list')
                if (cachedContacts) {
                    try {
                        this.quick_contacts_list = JSON.parse(cachedContacts)
                        this.api_contact_status = 'success'
                    } catch (e) {
                        console.error('Error parsing quick_contacts_list from sessionStorage', e)
                        this.quick_contacts_list = []
                        this.api_contact_status = 'error'
                    }
                } else {
                    this.api_contact_status = 'loading'
                    try {
                        const res = await this.apiDispatcher('/contact/specific', 'specific')
                        if (res && res.data) {
                            const filtered = res.data.filter((contact: any) => {
                                return contact.image_url && contact.image_url !== ''
                            })
                            this.quick_contacts_list = filtered
                            if (filtered.length > 0) {
                                this.api_contact_status = 'success'
                                sessionStorage.setItem('quick_contacts_list', JSON.stringify(filtered))
                            } else {
                                this.api_contact_status = 'error'
                            }
                        }
                    } catch (error: any) {
                        console.error('Error fetching contacts', error)
                        this.quick_contacts_list = []
                        this.api_contact_status = 'error'
                    }
                }
            }
        }
    }
})
