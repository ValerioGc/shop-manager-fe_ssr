<script setup lang="ts">

    import { ref, computed } from '#imports';
    
    import italianFlag from '@/assets/flags/ita.svg'
    import englishFlag from '@/assets/flags/eng.svg'

    const language = ref<'it' | 'en'>('it')

    const messages = {
        it: {
            message: 'Lorem ipsum dolent Lorem ipsum dolent Lorem ipsum dolent.',
            contactMessage: 'Lorem ipsum dolent Lorem ipsum dolent Lorem ipsum dolent Lorem ipsum dolent',
            buttonText: 'Change Language',
            flag: englishFlag
        },
        en: {
            message: 'Lorem ipsum dolent. Lorem ipsum dolent. Lorem ipsum dolent',
            contactMessage: 'Lorem ipsum dolent Lorem ipsum dolent Lorem ipsum dolent Lorem ipsum dolent ',
            buttonText: 'Cambia Lingua',
            flag: italianFlag
        }
    }

    const message = computed(() => messages[language.value].message)
    const contactMessage = computed(() => messages[language.value].contactMessage)
    const buttonText = computed(() => messages[language.value].buttonText)
    const nextFlag = computed(() => messages[language.value].flag)
    const nextLanguage = computed(() => language.value === 'it' ? 'en' : 'it')

    function toggleLanguage(): void {
        language.value = nextLanguage.value
    }

</script>

<template>
    <div class="maintenance_container">
        <div class="language_switch_container">
            <button @click="toggleLanguage" class="language_switch btn_e btn_primary">
                <img :src="nextFlag" :alt="nextLanguage" class="flag">
                <span>{{ buttonText }}</span>
            </button>
        </div>
        <div class="maintenance_message">

            <img src="@/assets/logo.svg" alt="ShopName Logo" loading="eager" />

            <div>
                <h1>Shop Name</h1>
                <p><em>{{ message }}</em></p>
                <p>
                    {{ contactMessage }}
                    <a href="tel:+39333333333" alt="telephone number" :title="language==='it'?'Telefona':'Phone'">333 333 3365</a>
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    .maintenance_container {
        @extend %full_page_center;
        flex-direction: column;
        overflow: hidden;
        background-color: #fafafa;
        font-family: Arial, sans-serif;
        padding: 4rem 1rem;
        
        @media screen and (min-width: 450px) {
            padding: 4rem 2rem;
        }

        .language_switch_container {
            position: absolute;
            top: .5rem;
            right: .5rem;

            @media screen and (min-width: 768px) {
                top: 1rem;
                right: 1rem;
            }

            .language_switch {
                @extend %fx_between_center;
                padding: .35rem;
                box-shadow: 0 0 6px -1px #77777780;

                &:hover {
                    filter: brightness(0.9);
                }
                
                .flag {
                    width: 24px;
                    height: 18px;
                    margin-right: 10px;
                }
            }
        }

        .maintenance_message {
            height: 100%;
            align-content: center;
            color: #333;

            img {
                width: 200px;
                height: auto;
                
                @media screen and (min-width: 300px) {
                    width: 250px;
                }

                @media screen and (min-width: 768px) {
                    width: 350px;
                }
            }

            h1 {
                font-size: 2rem;
                margin: 1.25rem auto;
                color: var(--secondary-color);
            }

            h1,
            p a {
                font-weight: bold;
            }

            p {
                font-size: 1.1rem;
                margin: 0 0 1rem;

                a {
                    color:var(--secondary-color);
                    font-style: italic;
                }
            }
        }
    }

</style>
