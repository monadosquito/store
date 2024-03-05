type UserLabel = {
    email: string
    password: string
}

type NamedUserLabel = {
    [L in keyof UserLabel]: UserLabel[L]
} & {
    name_: 'Name'
}

type ProductCardLabel = {
    sellerId: 'Seller Id'
    name_: 'Name'
}

type Label = {
    user: UserLabel
    namedUser: NamedUserLabel
    productCard: ProductCardLabel
}


const label: Label = {
    user: {
        email: 'E-Mail',
        password: 'Password',
    },
    namedUser: {
        email: 'E-Mail',
        password: 'Password',
        name_: 'Name',
    },
    productCard: {
        sellerId: 'Seller Id',
        name_: 'Name',
    },
}


export type { Label }
export { label }
