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
        <ValidForm endpoint='/sign-up' initEnt={initUser} />
    </main>


export { SignUp }
