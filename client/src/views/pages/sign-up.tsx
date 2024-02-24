import { Entity } from '../../server/src/core/user'

import { ValidForm } from '../valid-form'


const initUser: Entity = {
    tag: 'namedUser',
    email: '',
    name_: '',
    password: '',
}

const SignUp = () =>
    <main>
        <ValidForm
            endpoint='/sign-in'
            leg="Fill in new user's data"
            subBtnLab='Sign up'
            initEnt={initUser}
        />
    </main>


export { SignUp }
