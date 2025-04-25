// types/Product.ts

export interface Product {
    id: string | number;
    label_ita: string;
    label_eng: string;
    price: number;
    image_url?: string;
    draft: boolean;
    deleting: boolean;
    code?: string;
    condition?: object;
    description_eng?: string;
    description_ita?: string;
    images_url?: string[];
    quantity: number;
    year?: string;
}
