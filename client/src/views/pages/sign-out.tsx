import { configuration } from '../../server/src/core/configuration'
import { Outlet } from 'react-router-dom'


const SignOut = () => {
    const signOut = () => {
        fetch('/' + configuration.protectedEndpointPrefix + '/sign-out')
    }
    return (
        <div>
            <button onClick={signOut} > Sign out </button>
            <Outlet/>
        </div>
    )
}


export { SignOut }
