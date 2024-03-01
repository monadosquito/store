import { EffectfulError } from './error'
import { Maybe, callEach } from '../utility'


type CharacterPredicate = (character: string) => boolean

type Predicate = (fieldValue: string) => Maybe<LabeledError>

type Direction = 'left' | 'right'

type LabeledError = {
    fieldName: string
    error: string
}

type OutsideError = Pick<LabeledError, 'fieldName'> & {
    error: EffectfulError
    validated: boolean
}


const isLowerCaseLetter = (letter: string) => {
    return (letter.match(/[a-z]/g)?.length ?? 0) === 1
}

const isUpperCaseLetter = (letter: string) => {
    return (letter.match(/[A-Z]/g)?.length ?? 0) === 1
}

const isNumber = (number: string) => {
    return (number.match(/[0-9]/g)?.length ?? 0) === 1
}

const includes =
    (predicates: CharacterPredicate[]) =>
    (characters: string) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): Maybe<LabeledError> => {
    const includes = [ ...characters ].every(
        (c: string) => fieldValue.includes(c)
    )
    const predicatesSatisfied = predicates.every(
        p => [ ...fieldValue ].some(c => p(c))
    )
    return includes && predicatesSatisfied ? null : labeledError
}

const longerThan =
    (length: number) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): Maybe<LabeledError> => {
    const longEnough = fieldValue.length >= length
    return longEnough ? null : labeledError
}

const notDeliminatesWith =
    (direction: Direction) =>
    (predicates: CharacterPredicate[]) =>
    (characters: string[]) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): Maybe<LabeledError> => {
    const characterIndex = direction === 'left' ? 0 : fieldValue.length - 1
    const character = fieldValue.charAt(characterIndex)
    const startsWith = predicates.some(p => p(character))
                     || characters.some(c => c === character)
    return !startsWith ? null : labeledError
}

const notEmpty =
    (labeledError: LabeledError) =>
    (fieldValue: string): Maybe<LabeledError> => {
    const empty = fieldValue === ''
    return !empty ? null : labeledError
}

const shorterThan =
    (length: number) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): Maybe<LabeledError> => {
    const tooLong = fieldValue.length <= length
    return tooLong ? null : labeledError
}

const simpleWith =
    (againstCharacters: string[]) =>
    (labeledError: LabeledError) =>
    (fieldValue: string): Maybe<LabeledError> => {
    const characters = [ ...fieldValue ]
    const simpleWith = characters.every(
        c => againstCharacters.some(againstC => {
            const charactersSimple = (
                callEach<string, boolean>
                    ([ isLowerCaseLetter, isUpperCaseLetter, isNumber ])
                    (c)
            ).includes(true)
            return againstC === c || charactersSimple
        })
    )
    return simpleWith ? null : labeledError
}

export type { LabeledError, Predicate, OutsideError }
export {
    includes,
    isNumber,
    isLowerCaseLetter,
    isUpperCaseLetter,
    longerThan,
    notDeliminatesWith,
    notEmpty,
    simpleWith,
    shorterThan,
}
