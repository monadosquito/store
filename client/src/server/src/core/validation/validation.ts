import { configuration } from '../configuration'
import { EffectfulError, allErrors } from './error'
import {
    LabeledError,
    Predicate,
    OutsideError,
    includes,
    isNumber,
    isLowerCaseLetter,
    isUpperCaseLetter,
    longerThan,
    notDeliminatesWith,
    notEmpty,
    simpleWith,
    shorterThan,
} from './predicate'
import { Entity } from '../user'
import { Maybe, callEach, clean, nub } from '../utility'


const emailOutsideErrors = (outsideErrors: OutsideError[]) =>
    outsideErrors.map(
        ({ fieldName, error, validated }) =>
            validated ? null : { fieldName, error: allErrors.user.email[error] }
    )


const validate =
    (outerErrors: OutsideError[]) =>
    (user: Entity): LabeledError[] => {
    const { password, email } = user
    const emailPredicates: Predicate[] = [
        includes ([]) ('@') ({
            fieldName: 'email',
            error: allErrors.user.email.notIncludes,
        }),
        longerThan (configuration.userEmailMinLength) ({
            fieldName: 'email',
            error: allErrors.user.email.longerThan,
        }),
        notDeliminatesWith ('left') ([isNumber]) (['.', '@']) ({
            fieldName: 'email',
            error: allErrors.user.email.deliminatesWith,
        }),
        notDeliminatesWith ('right') ([]) (['.', '@']) ({
            fieldName: 'email',
            error: allErrors.user.email.deliminatesWith,
        }),
        notEmpty ({
            fieldName: 'email',
            error: allErrors.user.email.empty,
        }),
        shorterThan (configuration.userEmailMaxLength) ({
            fieldName: 'email',
            error: allErrors.user.email.shorterThan,
        }),
        simpleWith ([ ..."!#$%&'*+-./=?^_`{|}~@" ]) ({
            fieldName: 'email',
            error: allErrors.user.email.notSimpleWith,
        }),
    ]
    const passwordPredicates: Predicate[] = [
        includes ([isLowerCaseLetter, isUpperCaseLetter, isNumber]) ('') ({
            fieldName: 'password',
            error: allErrors.user.password.notIncludes,
        }),
        longerThan (configuration.userPasswordMinLength) ({
            fieldName: 'password',
            error: allErrors.user.password.shorterThan,
        }),
        notEmpty ({
            fieldName: 'password',
            error: allErrors.user.password.empty,
        }),
    ]
    const emailOuterErrors = emailOutsideErrors(outerErrors)
    const emailErrors = emailOuterErrors.concat(callEach<string, Maybe<LabeledError>>
                                 (emailPredicates)
                                 (email))
    // const emailErrors = outerErrors.concat(emailInnerErrors)
    const passwordErrors = callEach<string, LabeledError | null>
                               (passwordPredicates)
                               (password)
    switch (user.tag) {
        case 'user':
            return nub(clean<LabeledError>(
                [ ...emailErrors, ...passwordErrors ]
            ))
        case 'namedUser':
            const { name_ } = user
            const namePredicates: Predicate[] = [
                longerThan (configuration.userNameMinLength) ({
                    fieldName: 'name_',
                    error: allErrors.namedUser.name_.longerThan,
                }),
                notDeliminatesWith ('left') ([isNumber]) ([]) ({
                    fieldName: 'name_',
                    error: allErrors.namedUser.name_.deliminatesWith,
                }),
                notEmpty ({
                    fieldName: 'name_',
                    error: allErrors.namedUser.name_.empty,
                }),
                shorterThan (configuration.userNameMaxLength) ({
                    fieldName: 'name_',
                    error: allErrors.namedUser.name_.shorterThan,
                }),
                simpleWith (['-', '_']) ({
                    fieldName: 'name_',
                    error: allErrors.namedUser.name_.notSimpleWith,
                }),
            ]
            const nameErrors = callEach<string, LabeledError | null>
                                   (namePredicates)
                                   (name_)
            return nub(clean<LabeledError>(
                [ ...emailErrors, ...passwordErrors, ...nameErrors ]
            ))
    }
}

const isValid = (es: OutsideError[]) => (e: Entity): boolean =>
    validate(es)(e).length === 0


export type { LabeledError }
export { validate, isValid }
