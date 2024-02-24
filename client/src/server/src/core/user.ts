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

type NamedUser = {
    name_: string
} & User

type Entity = User & { tag: 'user' } | NamedUser & { tag: 'namedUser' }

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

type Predicate = (fieldValue: string) => LabeledError | null

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

type PasswordValidation = 'longerThan' | 'notEmpty'

type PasswordValidationError = {
    [V in Extract<Validation, PasswordValidation>]: string
}

type NameValidation = Exclude<Validation, 'includes'>

type NameValidationError = {
    [V in Extract<Validation, NameValidation>]: string
}

type EmailValidation = Validation

type EmailValidationError = {
    [V in Extract<Validation, EmailValidation>]: string
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
    longerThan:
        'User '
        + label.user.password
        + ' must be at least '
        + configuration.userPasswordMinLength
        + ' characters long.'
    ,
    notEmpty: 'User ' + label.user.password + ' must not be empty.',
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
const simpleWith =
    (characters: string[]) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): LabeledError | null => {
    const simpleWith = [...fieldValue].every(
        character => characters.some(againstCharacter => {
            return againstCharacter === character
                   || isLetter(character)
                   || isNumber(character)
        })
    )
    return simpleWith ? null : labeledError
}

const includes =
    (characters: string) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): LabeledError | null => {
    const includesEach = [...characters].every(c => fieldValue.includes(c))
    return includesEach ? null : labeledError
}

const longerThan =
    (length: number) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): LabeledError | null => {
    const longEnough = fieldValue.length >= length
    return longEnough ? null : labeledError
}
const notEmpty =
    (labeledError: LabeledError) =>
    (fieldValue: string): LabeledError | null => {
    const empty = fieldValue === ''
    return !empty ? null : labeledError
}
const shorterThan =
    (length: number) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): LabeledError | null => {
    const tooLong = fieldValue.length <= length
    return tooLong ? null : labeledError
}

const notDeliminatesWith =
    (direction: Direction) =>
    (predicates: CharacterPredicate[]) =>
    (characters: string[]) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): LabeledError | null => {
    const characterIndex = direction === 'left' ? 0 : fieldValue.length - 1
    const character = fieldValue.charAt(characterIndex)
    const startsWith = predicates.some(p => p(character))
                     || characters.some(c => c === character)
    return !startsWith ? null : labeledError
}

const clearErrors = (errors: (LabeledError | null)[]): LabeledError[] =>
    [ ...new Set(errors) ].flatMap(
        (e: LabeledError | null) => e !== null ? [e] : []
    )

const callEach =
    <I, O>(fs: ((x: I) => O)[]) =>
    (x: I): O[] =>
    fs.map((f: any) => f(x))

const validate = (user: Entity): LabeledError[] => {
    const { password, email } = user
    const emailErrors: Predicate[] = [
            includes
                ('@')
                ({
                    fieldName: 'email',
                    error: validationError.user.email.includes,
                }),
            longerThan
                (configuration.userEmailMinLength)
                ({
                    fieldName: 'email',
                    error: validationError.user.email.longerThan,
                }),
            notDeliminatesWith
                ('left')
                ([isNumber])
                (['.'])
                ({
                    fieldName: 'email',
                    error: validationError.user.email.notDeliminatesWith,
                }),
            notDeliminatesWith
                ('right')
                ([])
                (['.'])
                ({
                    fieldName: 'email',
                    error: validationError.user.email.notDeliminatesWith,
                }),
            notEmpty
                ({
                    fieldName: 'email',
                    error: validationError.user.email.notEmpty,
                }),
            shorterThan
                (configuration.userEmailMaxLength)
                ({
                    fieldName: 'email',
                    error: validationError.user.email.shorterThan,
                }),
            simpleWith
                ([ ..."!#$%&'*+-./=?^_`{|}~@" ])
                ({
                    fieldName: 'email',
                    error: validationError.user.email.simpleWith,
                }),
        ]
    const passwordErrors: Predicate[] = [
            longerThan
                (configuration.userPasswordMinLength)
                ({
                    fieldName: 'password',
                    error: validationError.user.password.longerThan,
                }),
            notEmpty
                ({
                    fieldName: 'password',
                    error: validationError.user.password.notEmpty,
                }),
        ]
    switch (user.tag) {
        case 'user':
            // return clearErrors([ ...emailErrors, ...passwordErrors ])
            const emailErrors_ = callEach<string, LabeledError | null>(emailErrors)(email)
            const passwordErrors_ = callEach<string, LabeledError | null>(passwordErrors)(password)
            const errors = [ ...emailErrors_, ...passwordErrors_ ]
            return clearErrors(errors)
        case 'namedUser':
            const { name_ } = user
            const nameErrors: Predicate[] = [
                longerThan
                    (configuration.userNameMinLength)
                    ({
                        fieldName: 'name_',
                        error: validationError.namedUser.name_.longerThan,
                    }),
                notDeliminatesWith
                    ('left')
                    ([isNumber])
                    ([])
                    ({
                        fieldName: 'name_',
                        error: validationError.namedUser
                                              .name_
                                              .notDeliminatesWith,
                    }),
                notEmpty
                    ({
                        fieldName: 'name_',
                        error: validationError.namedUser.name_.notEmpty,
                    }),
                shorterThan
                    (configuration.userNameMaxLength)
                    ({
                        fieldName: 'name_',
                        error: validationError.namedUser.name_.shorterThan,
                    }),
                simpleWith
                    (['-', '_'])
                    ({
                        fieldName: 'name_',
                        error: validationError.namedUser.name_.simpleWith,
                    }),
            ]
            const emailErrors__ = callEach<string, LabeledError | null>(emailErrors)(email)
            const passwordErrors__ = callEach<string, LabeledError | null>(passwordErrors)(password)
            const nameErrors__ = callEach<string, LabeledError | null>(nameErrors)(name_)
            const errors_ = [ ...emailErrors__, ...passwordErrors__, ...nameErrors__ ]
            return clearErrors(errors_)
    }
}

const isValid = (e: Entity): boolean => validate(e).length === 0

export type { Endpoint, Entity , Label, LabeledError, User, NamedUser, UserSession }
export { label, validate, isValid }
