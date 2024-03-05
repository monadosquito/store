import { ProductCard } from '../../server/src/core/product-card'
import { Ided } from '../../server/src/core/utility'
import { Entity } from '../../server/src/core/user'

import { ValidForm } from '../valid-form'
import { ProdCard } from '../prod-card'

import { useLoaderData } from 'react-router-dom'


type ProdCardProps = {
    prodCard: Ided<ProductCard>
}


const AddProdCard = () => {
    const initProdCard: ProductCard = {
        description: '',
        name_: '',
        images: [],
        mainImageIndex: 0,
    }
    return (
        <main>
            <ProdCard
                editable
                act='/product/add'
                subBtnLab='Add New Product'
                initProdCard={initProdCard}
            />
        </main>
    )
}


export { AddProdCard }
