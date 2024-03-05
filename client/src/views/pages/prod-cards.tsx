import { ForSaleProductCard } from '../../server/src/core/product-card'
import { Ided } from '../../server/src/core/utility'

import ProdSyn from '../prod-syn'

import { NavLink, useLoaderData } from 'react-router-dom'


const ProdCards = () => {
    const prodCards = useLoaderData() as Ided<ForSaleProductCard>[]

    return (
        <main>
            <ul>
                {prodCards.map(
                    (prodCard: Ided<ForSaleProductCard>) => {
                        const { id } = prodCard

                        return <ProdSyn key={id} prodCard={prodCard} />
                    }
                )}
            </ul>
            <NavLink to={'/product/add'}>
                <button> Add New Product </button>
            </NavLink>
        </main>
    )
}


export { ProdCards }
