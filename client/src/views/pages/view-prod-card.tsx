import { ForSaleProductCard } from '../../server/src/core/product-card'
import { Ided } from '../../server/src/core/utility'

import { State } from '../../store'

import { ProdCard } from '../prod-card'

import { useSelector } from 'react-redux'
import { useLoaderData } from 'react-router-dom'


const ViewProdCard = () => {
    const prodCard = useLoaderData() as Ided<ForSaleProductCard>
    const { sellerId } = prodCard
    const userId = useSelector((state: State) => state.userId)
    const userSeller = sellerId === userId
    return (
        <main>
            <ProdCard initProdCard={prodCard} />
        </main>
    )
}


export { ViewProdCard }
