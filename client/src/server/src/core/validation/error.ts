import { label } from './label'
import { configuration } from '../configuration'


type Error_ = 'notIncludes'
            | 'longerThan'
            | 'empty'
            | 'deliminatesWith'
            | 'shorterThan'
            | 'notSimpleWith'

type Errors<E> = {
    [V in Extract<Error_, E>]: string
}

type UserEmailError = Error_

type UserPasswordError
    =
    Extract<Error_, 'empty' | 'notIncludes' | 'shorterThan'>

type UserNameError = Exclude<Error_, 'notIncludes'>

type AllErrors = {
    user: {
        email: Errors<UserEmailError>
        password: Errors<UserPasswordError>
    },
    namedUser: {
        email: Errors<UserEmailError>
        password: Errors<UserPasswordError>
        name_: Errors<UserNameError>
    },
}

const userEmail: Errors<UserEmailError> = {
    deliminatesWith:
        'User '
        + label.user.email
        + ' must not start with a number and deliminate with the "." and "@" characters.',
    empty: 'User ' + label.user.email + ' must not be empty.',
    longerThan:
        'User '
        + label.user.email
        + ' must be longer than '
        + configuration.userEmailMinLength
        + ' characters.'
    ,
    notIncludes:
        'User '
        + label.user.email
        + ' must include at least one "@" character.',
    notSimpleWith:
        'User '
        + label.user.email
        + ' must contain only "0-9", "a-Z", and the '
        + `"!#$%&'*+-./=?^_\`{|}~@"`
        + ' characters.'
    ,
    shorterThan:
        'User '
        + label.user.email
        + ' must be at most '
        + configuration.userEmailMaxLength
        + ' characters long.'
    ,
}
const userPassword: Errors<UserPasswordError> = {
    empty: 'User ' + label.user.password + ' must not be empty.',
    notIncludes:
        'User '
        + label.user.password
        + ' must contain at least one of the 0-9, a-z characters',
    shorterThan:
        'User '
        + label.user.password
        + ' must be at least '
        + configuration.userPasswordMinLength
        + ' characters long.'
    ,
}

const allErrors: AllErrors = {
    user: {
        email: userEmail,
        password: userPassword,
    },
    namedUser: {
        email: userEmail,
        password: userPassword,
        name_: {
            deliminatesWith:
                'User '
                + label.namedUser.name_
                + ' must not start with a number.'
            ,
            empty: 'User ' + label.namedUser.name_ + ' must not be empty.',
            longerThan: 
                'User '
                + label.namedUser.name_
                + ' must be at least '
                + configuration.userNameMinLength
                + ' characters long.'
            ,
            notSimpleWith:
                'User '
                + label.namedUser.name_
                + ' must contain only "0-9", "a-Z", and the "-_" characters.'
            ,
            shorterThan:
                'User '
                + label.namedUser.name_
                + ' must be at most '
                + configuration.userNameMaxLength
                + ' characters long.'
            ,
        },
    },
}


export type { Error_, Errors, AllErrors }
export { allErrors }
