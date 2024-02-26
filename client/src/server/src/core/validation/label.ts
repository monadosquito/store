type UserLabel = {
    email: string
    password: string
}

type NamedUserLabel = {
    [L in keyof UserLabel]: UserLabel[L]
} & {
    name_: 'Name'
}

type Label = {
    user: UserLabel
    namedUser: NamedUserLabel
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
}


export type { Label }
export { label }
