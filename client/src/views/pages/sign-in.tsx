import { Entity } from '../../server/src/core/user'

import { ValidForm } from '../valid-form'


const initUser: Entity = { tag: 'user', email: '', password: '' }

const SignIn = () => 
    <main> <ValidForm endpoint='/sign-in' initEnt={initUser} /> </main>


export { SignIn }
