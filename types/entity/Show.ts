// types/Show.ts

export interface Show {
    id: string | number;
    label_ita: string;
    label_eng: string;
    price: number;
    description?: string;
    image_url?: string;
    draft: boolean;
    deleting: boolean;
    year: number;
    // TODO: aggiungere altre proprietà

}
