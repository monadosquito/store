import { Endpoint, User, NamedUser, Entity } from '../server/src/core/user'
import { ProductCard } from '../server/src/core/product-card'
import { LabeledError, validate } from '../server/src/core/validation/validation'
import { Label, label } from '../server/src/core/validation/label'
import { OutsideError } from '../server/src/core/validation/predicate'
import { appendParams } from '../server/src/core/utility'

import React, { useEffect, useState } from 'react'
import { Form } from 'react-router-dom'


type FormProps = {
    endpoint: Endpoint
    leg: string
    subBtnLab: string
    initEnt: Entity
    validEnpoint?: string
    ks: (keyof Entity)[]
    handle?: any
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
    hidden: boolean,
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
                type={hidden ? 'password' : ''}
            />
        </label>
    )
}

const emailNotFreeErr = (validated: boolean): OutsideError =>
    ({ fieldName: 'email', error: 'notFree', validated })
    

const ValidForm: React.FC<FormProps> = (
    { endpoint, validEnpoint, ks, leg, subBtnLab, initEnt, handle }
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
                }).then((resp: any) => {
                    if (handle && resp.ok) {
                        resp.json().then(handle)
                    }
                })
            }
        }
        setSubmitted(false)
    }, [ submitted ])
    useEffect(() => {
        const outerValidFieldVals = ks.map(k => ent[k])
        const outerValidFieldValsValid = outerValidFieldVals.every(v => v)
        if (validEnpoint && outerValidFieldValsValid) {
            const url = appendParams(ks)(ent)(validEnpoint)
            fetch(url)
            .then((resp) => resp.json())
            .then(({ emailFree }: { emailFree: boolean }) => {
                setValidErrs(validate([emailNotFreeErr(emailFree)])(ent))
            })
        }
    }, [ ent ])

    const handleInput = (
            fieldName: string,
            ev: React.ChangeEvent<HTMLInputElement>,
        ): void => {
        const nextEnt: Entity = { ...ent, [fieldName]: ev.target.value }
        setEnt(nextEnt)
        handleValidErrs(nextEnt)
    }
    const handleValidErrs = (ent: Entity) => {
        const validErrs = validate([])(ent)
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
                                    fieldName === 'password' ? true : false,
                                    initEnt.tag,
                                    fieldName as keyof User,
                                )
                                : field(
                                    handleInput,
                                    isValid,
                                    fieldName === 'password' ? true : false,
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
