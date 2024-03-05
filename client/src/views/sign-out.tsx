import { configuration } from '../server/src/core/configuration'

import { signOut, useAppDispatch } from '../store'


const SignOut = () => {
    const dispatch = useAppDispatch()

    const signOut_ = () => {
        fetch('/' + configuration.protectedEndpointPrefix + '/sign-out')
        dispatch(signOut()) 
    }
    return (
        <div>
            <button onClick={signOut_} > Sign out </button>
        </div>
    )
}


export { SignOut }
