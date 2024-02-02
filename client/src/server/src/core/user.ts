import { Configuration, configuration } from './configuration'


type Endpoint = '/sign-up' | '/sign-in'

type CharacterPredicate = (character: string) => boolean

type Direction = 'left' | 'right'

type User = {
    password: string
    email: string
}

type LabeledError = {
    fieldName: string
    error: string
}

type UserField = keyof User

type NamedUser = {
    name_: string
} & User

type NamedUser_ = 'email' | 'name_' | 'password'

type NamedUserField = keyof NamedUser

type Entity = User & { tag: 'user' } | NamedUser & { tag: 'namedUser' }

type EntityName = keyof Label

type EntityField = User | NamedUserField


type UserLabel = {
    email: string
    password: string
}

type NamedUserLabel = {
    [L in keyof UserLabel]: UserLabel[L]
} & {
    name_: 'Name'
}
type NamedUserLabel_ = {
    email: string
    password: string
    name_: string
}

type Label = {
    user: UserLabel
    namedUser: NamedUserLabel_
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

type ValidationError = {
    user: {
        email: EmailValidationError
        password: PasswordValidationError
    },
    namedUser: {
        email: EmailValidationError
        name_: NameValidationError
        password: PasswordValidationError
    },
}
type PasswordValidationError_ = {
    includes: null
    longerThan: null
    notEmpty: null
    shorterThan: null
    simpleWith: null
    startsWithNonNumber: null
}


type EmailValidationError_ = {
    includes: string
    longerThan: null
    notEmpty: null
    shorterThan: null
    simpleWith: null
    startsWithNonNumber: null
}

type PasswordValidationError = {
    includes: null
    longerThan: string
    notEmpty: string
    notDeliminatesWith: null
    shorterThan: null
    simpleWith: null
}

type NameValidationError = {
    includes: null
    longerThan: string
    notEmpty: string
    notDeliminatesWith: string
    shorterThan: string
    simpleWith: string
}

type EmailValidationError = {
    includes: string
    longerThan: string
    notEmpty: string
    notDeliminatesWith: string
    shorterThan: string
    simpleWith: string
}

type UserSession = {
    sessionId: string
    userId: number
}

type Validation = 'includes'
                | 'longerThan'
                | 'notEmpty'
                | 'notDeliminatesWith'
                | 'shorterThan'
                | 'simpleWith'
                | 'startsWithNonNumber'


const userEmail: EmailValidationError = {
    includes:
        'User '
        + label.user.email
        + ' must include at least one "@" character.',
    longerThan:
        'User '
        + label.user.email
        + ' must be longer than '
        + configuration.userEmailMinLength
        + ' characters.'
    ,
    notEmpty: 'User ' + label.user.email + ' must not be empty.',
    notDeliminatesWith:
        'User '
        + label.user.email
        + ' must not start with a number and deliminate with a period.',
    shorterThan:
        'User '
        + label.user.email
        + ' must be at most '
        + configuration.userEmailMaxLength
        + ' characters long.'
    ,
    simpleWith:
        'User '
        + label.user.email
        + ' must contain only "0-9", "a-Z", and the '
        + `"!#$%&'*+-./=?^_\`{|}~@"`
        + ' characters.'
    ,
}
const userPassword: PasswordValidationError = {
    includes: null,
    longerThan:
        'User '
        + label.user.password
        + ' must be at least '
        + configuration.userPasswordMinLength
        + ' characters long.'
    ,
    notEmpty: 'User ' + label.user.password + ' must not be empty.',
    notDeliminatesWith: null,
    shorterThan: null,
    simpleWith: null,
}


const checkExhaustive = (x: never): void => {}

const validationError: ValidationError = {
    user: {
        email: userEmail,
        password: userPassword,
    },
    namedUser: {
        email: userEmail,
        password: userPassword,
        name_: {
            includes: null,
            longerThan: 
                'User '
                + label.namedUser.name_
                + ' must be at least '
                + configuration.userNameMinLength
                + ' characters long.'
            ,
            notEmpty: 'User ' + label.namedUser.name_ + ' must not be empty.',
            notDeliminatesWith:
                'User '
                + label.namedUser.name_
                + ' must not start with a number.'
            ,
            shorterThan:
                'User '
                + label.namedUser.name_
                + ' must be at most '
                + configuration.userNameMaxLength
                + ' characters long.'
            ,
            simpleWith:
                'User '
                + label.namedUser.name_
                + ' must contain only "0-9", "a-Z", and the "-_" characters.'
            ,
        },
    },
}

const isLetter = (letter: string) => {
    return (letter.match(/[A-Z]/gi)?.length ?? 0) === 1
}
const isNumber = (number: string) => {
    return (number.match(/[1-9]/gi)?.length ?? 0) === 1
}
const simpleWith = (
    characters: string[],
    labeledError: LabeledError,
    fieldValue: string,
): LabeledError | null => {
    const simpleWith = [...fieldValue].every(
        character => characters.some(againstCharacter => {
            return againstCharacter === character
                   || isLetter(character)
                   || isNumber(character)
        })
    )
    return simpleWith ? null : labeledError
}
const includes = (
    characters: string,
    labeledError: LabeledError,
    fieldValue: string
): LabeledError | null => {
    const includesEach = [...characters].every(c => fieldValue.includes(c))
    return includesEach ? null : labeledError
}
const longerThan = (
    length: number,
    labeledError: LabeledError,
    fieldValue: string,
): LabeledError | null => {
    const longEnough = fieldValue.length >= length
    return longEnough ? null : labeledError
}
const notEmpty = (
    labeledError: LabeledError,
    fieldValue: string
): LabeledError | null => {
    const empty = fieldValue === ''
    return !empty ? null : labeledError
}
const shorterThan = (
    length: number,
    labeledError: LabeledError,
    fieldValue: string,
): LabeledError | null => {
    const tooLong = fieldValue.length <= length
    return tooLong ? null : labeledError
}
const clearErrors = (errors: (LabeledError | null)[]): LabeledError[] =>
    [ ...new Set(errors) ].flatMap(
        (e: LabeledError | null) => e !== null ? [e] : []
    )

const validate = (user: Entity): LabeledError[] => {
    const notDeliminatesWith = (
        direction: Direction,
        predicates: CharacterPredicate[],
        characters: string[],
        labeledError: LabeledError,
        fieldValue: string,
    ): LabeledError | null => {
        const characterIndex = direction === 'left' ? 0 : fieldValue.length - 1
        const character = fieldValue.charAt(characterIndex)
        const startsWith = predicates.some(p => p(character))
                         || characters.some(c => c === character)
        return !startsWith ? null : labeledError
    }
    const { password, email } = user
    const emailErrors: (LabeledError | null)[] = [
            includes(
                '@',
                {
                    fieldName: 'email',
                    error: validationError.user.email.includes,
                },
                email,
            ),
            longerThan(
                configuration.userEmailMinLength,
                {
                    fieldName: 'email',
                    error: validationError.user.email.longerThan,
                },
                email,
            ),
            notDeliminatesWith(
                'left',
                [isNumber],
                ['.'],
                {
                    fieldName: 'email',
                    error: validationError.user.email.notDeliminatesWith,
                },
                email,
            ),
            notDeliminatesWith(
                'right',
                [],
                ['.'],
                {
                    fieldName: 'email',
                    error: validationError.user.email.notDeliminatesWith,
                },
                email,
            ),
            notEmpty(
                {
                    fieldName: 'email',
                    error: validationError.user.email.notEmpty,
                },
                email,
            ),
            shorterThan(
                configuration.userEmailMaxLength,
                {
                    fieldName: 'email',
                    error: validationError.user.email.shorterThan,
                },
                email,
            ),
            simpleWith(
                [ ..."!#$%&'*+-./=?^_`{|}~@" ],
                {
                    fieldName: 'email',
                    error: validationError.user.email.simpleWith,
                },
                email,
            ),
        ]
    const passwordErrors: (LabeledError | null)[] = [
            longerThan(
                configuration.userPasswordMinLength,
                {
                    fieldName: 'password',
                    error: validationError.user.password.longerThan,
                },
                password,
            ),
            notEmpty(
                {
                    fieldName: 'password',
                    error: validationError.user.password.notEmpty,
                },
                password,
            ),
        ]
    switch (user.tag) {
        case 'user':
            return clearErrors([ ...emailErrors, ...passwordErrors ])
        case 'namedUser':
            const { name_, password, email } = user
            const nameErrors: (LabeledError | null)[] = [
                longerThan(
                    configuration.userNameMinLength,
                    {
                        fieldName: 'name_',
                        error: validationError.namedUser.name_.longerThan,
                    },
                    name_,
                ),
                notDeliminatesWith(
                    'left',
                    [isNumber],
                    [],
                    {
                        fieldName: 'name_',
                        error: validationError.namedUser
                                              .name_
                                              .notDeliminatesWith,
                    },
                    name_,
                ),
                notEmpty(
                    {
                        fieldName: 'name_',
                        error: validationError.namedUser.name_.notEmpty,
                    },
                    name_,
                ),
                shorterThan(
                    configuration.userNameMaxLength,
                    {
                        fieldName: 'name_',
                        error: validationError.namedUser.name_.shorterThan,
                    },
                    name_,
                ),
                simpleWith(
                    ['-', '_'],
                    {
                        fieldName: 'name_',
                        error: validationError.namedUser.name_.simpleWith,
                    },
                    name_,
                ),
            ]
            return clearErrors(
                [ ...emailErrors, ...passwordErrors, ...nameErrors ]
            )
    }
}


export type { Endpoint, Entity , Label, LabeledError, User, NamedUser, UserSession }
export { label, validate }
