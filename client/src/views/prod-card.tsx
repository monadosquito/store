import { configuration } from '../server/src/core/configuration'
import { ProductCardImage, ProductCard } from '../server/src/core/product-card'
import { Maybe } from '../server/src/core/utility'

import { Img } from './Img'

import useDelete from '../hook/delete'

import { Form } from 'react-router-dom'
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'


type ProdCardProps = {
    editable?: boolean
    act?: string
    subBtnLab?: string
    initProdCard: ProductCard
}

type Handle =
    (field: keyof ProductCard) =>
    (ev: React.ChangeEvent<HTMLInputElement>) =>
    void

type FieldProps<V extends string | ProductCardImage[]> = {
    editable?: boolean
    field: keyof ProductCard
    initVal: V
    lab: string
}

type FileFieldProps = FieldProps<ProductCardImage[]> & {
    initMainImgIx: number
    handleMainImgIx: (mainImgIx: number) => MouseEventHandler<HTMLImageElement>
}

const TextField =
    ({ editable=false, field, initVal, lab }: FieldProps<string>) =>
    <label>
        {lab}
        {editable}
        { editable
            ? <input required name={field} defaultValue={initVal} />
            : <span> {initVal} </span>
        }
    </label>

const FileField = ({
    editable=false,
    field,
    initVal,
    lab,
    initMainImgIx,
    handleMainImgIx, 
}: FileFieldProps) => {
    return (
        <label>
            {lab}
            {editable}
            {editable
                ?
                <div>
                    <ul>
                        {initVal.map((prodCardImg, i) =>
                            <Img
                                handleMainImgIx={handleMainImgIx(i)}
                                imgMain={i === initMainImgIx}
                                prodCardImg={prodCardImg}
                                key={prodCardImg.id}
                            />
                        )}
                    </ul>
                    <input
                        type='file'
                        multiple
                        name={field}
                        accept='image/*'
                    />
                </div>
            :
                <div>
                    { initVal.map(({ id, name_ }) =>
                        <img width='400' height='400' key={id} src={name_} />
                    )}
                </div>
            }
        </label>
    )
}


const ProdCard = ({
    editable=false,
    act,
    subBtnLab,
    initProdCard,
}: ProdCardProps) => {
    const {
        name_,
        description,
        images,
        mainImageIndex: initMainImgIx,
    } = initProdCard
    const [ mainImgIx, setMainImgIx ] = useState(initMainImgIx)
    const handleMainImgIx = (
        mainImgIx: number,
    ): MouseEventHandler<HTMLImageElement> => (e) => {
        e.preventDefault()
        setMainImgIx(mainImgIx)
    }

    return (
        <Form
            className='form'
            method='post'
            action={act}
            encType='multipart/form-data'
        >
            <TextField
                editable={editable}
                field='name_'
                initVal={name_}
                lab='Name'
            />
            <TextField
                editable={editable}
                field='description'
                initVal={description}
                lab='Description' 
            />
            <FileField
                editable={editable}
                field='images'
                initVal={images}
                lab='Images'
                initMainImgIx={mainImgIx}
                handleMainImgIx={handleMainImgIx}
            />
            <input type='hidden' name='mainImageIndex' value={mainImgIx} />
            { editable && subBtnLab
                ? <button type='submit'> {subBtnLab} </button>
                : null
            }
        </Form>
    )
}


export { ProdCard }
