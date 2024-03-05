import { ForSaleProductCard } from '../../server/src/core/product-card'
import { configuration } from '../../server/src/core/configuration'
import { Ided } from '../../server/src/core/utility'

import { ProdCard } from '../prod-card'

import useDelete from '../../hook/delete'

import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'


const EditProdCard = () => {
    const prodCard = useLoaderData() as Ided<ForSaleProductCard>
    const { id } = prodCard
    const handleDelete = useDelete(`/product/delete/${id}`)

    return (
        <main>
            <ProdCard
                editable
                act={`/product/edit/${id}`}
                subBtnLab='Save Product'
                initProdCard={prodCard}
            />
            <button onClick={handleDelete}> Delete Product </button>   
        </main>
    )
}


export { EditProdCard }
