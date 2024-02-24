import { Endpoint, User, NamedUser, Entity, Label, LabeledError, label, validate } from '../server/src/core/user'

import React, { useEffect, useState } from 'react'
import { Form } from 'react-router-dom'


type FormProps = {
    endpoint: Endpoint,
    leg: string,
    subBtnLab: string,
    initEnt: Entity,
}

const valStat = (validErrs: LabeledError[]) => {
    if (validErrs.length) {
        const html
            =
            <details className='form__val-stat'>
                <summary
                    className='form__val-stat-summ form__val-stat-summ_failed'
                >
                    Validation Errors ({validErrs.length})
                </summary>
                <ul>
                    {validErrs.map(
                        ({ error: e }: LabeledError) => <div key={e}> {e} </div>
                    )}
                </ul>
            </details>
        return html
    } else {
        return <div className='form__val-stat-summ'>Validated</div>
    }
}
type Test = ( fieldName: string, ev: React.ChangeEvent<HTMLInputElement>) => void

function field<L extends keyof Label, F extends keyof Label[L]>(
    handleInput: Test,
    isValid: boolean,
    entityName: L,
    fieldName: F,
) {
    const inputClass = 'form__field-input'
                     + (isValid ? '' : ' form__field-input_val-failed')
    return (
        <label className='form__field' key={fieldName as string}>
            <span>{label[entityName][fieldName] as string}</span>
            <input
                className={inputClass}
                onChange={ev => handleInput(fieldName as string, ev)}
                placeholder={label[entityName][fieldName] as string}
                key={fieldName as string}
            />
        </label>
    )
}

const ValidForm: React.FC<FormProps> = (
    { endpoint, leg, subBtnLab, initEnt }
) => {
    const [ ent, setEnt ] = useState(initEnt)
    const [ submitted, setSubmitted ] = useState(false)
    const initValidErrs: LabeledError[] = []
    const [ validErrs, setValidErrs ] = useState(initValidErrs)
    useEffect(() => {
        if (submitted) {
            if (validErrs.length === 0) {
                fetch(endpoint, {
                    method: 'POST',
                    body: JSON.stringify(ent),
                    headers: { 'Content-Type': 'application/json' },
                })
            }
        }
        setSubmitted(false)
    }, [ submitted ])

    const handleInput = (
            fieldName: string,
            ev: React.ChangeEvent<HTMLInputElement>,
        ): void => {
        const nextEnt: Entity = { ...ent, [fieldName]: ev.target.value }
        setEnt(nextEnt)
        handleValidErrs(nextEnt)
    }
    const handleValidErrs = (ent: Entity) => {
        const validErrs = validate(ent)
        setValidErrs(validErrs)
    }

    return (
        <div className='valid-form root__valid-form'>
            <form className='form valid-form__form' onSubmit={ event => {
                event.preventDefault()
                setSubmitted(true)
            }}>
                <fieldset className='form__fields'>
                    <legend> {leg} </legend>
                    { Object.keys(ent).filter(k => k !== 'tag').map(
                        fieldName => {
                            const isValid = validErrs.findIndex(
                                ({ fieldName: fn }: LabeledError) =>
                                    fn === fieldName
                            ) === -1
                            const fieldName_ = initEnt.tag === 'user'
                                ? field(
                                    handleInput,
                                    isValid,
                                    initEnt.tag,
                                    fieldName as keyof User,
                                )
                                : field(
                                    handleInput,
                                    isValid,
                                    initEnt.tag,
                                    fieldName as keyof NamedUser,
                                )
                            
                            return fieldName_
                        }
                    ) }
                </fieldset>
                <input type='submit' value={subBtnLab} />
            </form>
            {valStat(validErrs)}
        </div>
    );
}


export { ValidForm }
