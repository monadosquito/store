type Endpoint = '/sign-up' | '/sign-in'

type User = {
    password: string
    email: string
}

type NamedUser = {
    name_: string
} & User

type Entity = User & { tag: 'user' } | NamedUser & { tag: 'namedUser' }


type IdUser = User & { id: number }


type UserSession = {
    sessionId: string
    userId: number
}

// const clearErrors = (errors: (LabeledError | null)[]): LabeledError[] =>
//     [ ...new Set(errors) ].flatMap(
//         (e: LabeledError | null) => e !== null ? [e] : []
//     )

export type {
    Endpoint,
    Entity,
    User,
    NamedUser,
    IdUser,
    UserSession,
}
