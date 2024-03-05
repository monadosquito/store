import { Entity } from '../../server/src/core/user'

import { signIn, useAppDispatch } from '../../store'

import { ValidForm } from '../valid-form'


const initUser: Entity = { tag: 'user', email: '', password: '' }

const SignIn = () => {
    const disptach = useAppDispatch()

    return (
        <main>
            <ValidForm
                endpoint='/sign-in'
                leg="Fill in user's data"
                subBtnLab='Sign in'
                initEnt={initUser}
                ks={['email']}
                handle={(resp: any) => disptach(signIn(resp.userId))}
            />
        </main>
    )
}


export { SignIn }
