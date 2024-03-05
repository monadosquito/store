import { Ided } from "./utility"


type ProductCardImage = Ided<{ name_: string }>

type ProductCard = {
    name_: string
    description: string
    images: ProductCardImage[]
    mainImageIndex: number
}

type ForSaleProductCard = ProductCard & {
    sellerId: number
}


export type { ProductCardImage, ProductCard, ForSaleProductCard }
