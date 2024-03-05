import { configuration } from "../server/src/core/configuration"
import { ProductCardImage } from "../server/src/core/product-card"

import useDelete from '../hook/delete'

import { MouseEventHandler } from 'react'


type ImgProps = {
    handleMainImgIx: MouseEventHandler<HTMLImageElement>
    imgMain: boolean
    prodCardImg: ProductCardImage
}


const Img = ({
    handleMainImgIx,
    imgMain,
    prodCardImg: { id, name_ },
} : ImgProps) => {
    const handleDelete = useDelete(`/product/image/delete/${id}`)

    const imgUrl = `
        ${configuration.imagesUrl}/${name_}
    `
    const [ imgWidth, imgHeight ] = imgMain
                                  ? [
                                      configuration.mainImageWidth,
                                      configuration.mainImageHeight,
                                  ]
                                  : [
                                      configuration.imageWidth,
                                      configuration.imageHeight,
                                  ]

    return (
        <div>
            <img
                width={imgWidth}
                height={imgHeight}
                key={id}
                src={imgUrl}
                onClick={handleMainImgIx}
            />
        <button onClick={handleDelete}> Delete Image </button>   
        </div>
    )
}


export { Img }
