import { ForSaleProductCard } from '../server/src/core/product-card'
import { Ided } from '../server/src/core/utility'


const loadProdCards = async (): Promise<Ided<ForSaleProductCard>> => {
    const res = await fetch('/product/all')
    return res.json()
}


export { loadProdCards }
