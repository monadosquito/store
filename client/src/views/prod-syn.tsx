import { configuration } from '../server/src/core/configuration'
import { ForSaleProductCard } from '../server/src/core/product-card'
import { Ided } from '../server/src/core/utility'

import useDelete from '../hook/delete'

import { State } from '../store'

import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'


type ProdSynProps = {
    prodCard: Ided<ForSaleProductCard>
}


export default ({
    prodCard: { id, sellerId, name_, images, mainImageIndex },
}: ProdSynProps ) => {
    const handleDelete = useDelete(`/product/delete/${id}`)
    const userId = useSelector((state: State) => state.userId)
    const userSeller = userId === sellerId
    const prodCardLink = userSeller
                       ? `/product/edit/${id}`
                       : `/product/${id}`
    const mainImgName = images.length > 0
                      ? images[mainImageIndex].name_
                      : configuration.noImageName
    const mainImgUrl = `${configuration.imagesUrl}/${mainImgName}`

    return (
        <div key={id}>
            <NavLink to={prodCardLink}>
                <img
                    width={configuration.imageWidth}
                    height={configuration.imageHeight}
                    src={mainImgUrl}
                />
                <span> {name_} </span>
            </NavLink>
            { userSeller
                ? <button onClick={handleDelete}> Delete Product </button>
                : null
            }
        </div>
    )
}
