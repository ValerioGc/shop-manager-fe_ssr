// meta/homeSeoMeta.ts

export const homeSeoMeta = {
    name: 'home',
    title: 'Home',
    titolo: 'Home',
    description: {
        ita: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        eng: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    keywords: {
        ita:'TEST',
        eng:'TEST'
    },
    ogTitle:  {
        ita: 'Home | Store Name',
        eng: 'Home | Store Name'
    },
    ogDescription: {
        ita: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        eng: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    ogImage: 'https://shop-name.com/static/assets/logo.svg',
    ogUrl: 'https://www.shop-name.com/store-prefix',
};

function getLocalizedSeoMeta(language: string ): any{
    if (language === 'eng') {
        return {
            name: homeSeoMeta.name,
            title: homeSeoMeta.title,
            titolo: homeSeoMeta.titolo,
            description: homeSeoMeta.description.eng,
            keywords: homeSeoMeta.keywords,
            ogTitle: homeSeoMeta.ogTitle.eng,
            ogDescription: homeSeoMeta.ogDescription.eng,
            ogImage: homeSeoMeta.ogImage,
            ogUrl: homeSeoMeta.ogUrl
        }
    }
    else {
        return {
            name: homeSeoMeta.name,
            title: homeSeoMeta.title,
            titolo: homeSeoMeta.titolo,
            description: homeSeoMeta.description.ita,
            keywords: homeSeoMeta.keywords,
            ogTitle: homeSeoMeta.ogTitle.ita,
            ogDescription: homeSeoMeta.ogDescription.ita,
            ogImage: homeSeoMeta.ogImage,
            ogUrl: homeSeoMeta.ogUrl
        }
    }    
}



export { getLocalizedSeoMeta };