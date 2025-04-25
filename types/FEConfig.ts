// types/FEConfig.ts

export interface FEConfig {
    maintenance: boolean;
    pagination: {
        homeProductPagePagination: number;
        productPagePagination: number;
        showPageOldPagination: number;
        searchProductPagination: number;
    };
    settings: {
        showHomeBanner: boolean;
        enableShowBanner: boolean;
        bannerImg: string;
        showPageImg: string;
        showHomeTitle: boolean;
        showHomeShowSection: boolean;
        showContactMap: boolean;
        contactMapAddress: string;
    };
    titles: {
        homeTitleText: { ita: string; eng: string };
        faqPageTitle: { ita: string; eng: string };
        showPageTitle: { ita: string; eng: string };
        contactPageTitle: { ita: string; eng: string };
        contactMapTitle: { ita: string; eng: string };
        searchPageTitle: { ita: string; eng: string };
        footerTitle: { ita: string; eng: string };
    };
    text: {
        homePageDescriptionText: { ita: string; eng: string };
        homePageShowsText: { ita: string; eng: string };
        showsPageText: { ita: string; eng: string };
        showOldPageText: { ita: string; eng: string };
        showNextPageText: { ita: string; eng: string };
        contactPageText: { ita: string; eng: string };
        footerText: { ita: string; eng: string };
    };
}