import { ProductCard } from '../server/src/core/product-card'
import { Ided } from '../server/src/core/utility'


const loadProdCard = async ({ params }: any): Promise<Ided<ProductCard>> => {
    const res = await fetch(`/product/${params.id}`)
    return res.json()
}


export { loadProdCard }
