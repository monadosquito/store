import { configuration } from '../server/src/core/configuration'


const SignOut = () => {
    const signOut = () => {
        fetch('/' + configuration.protectedEndpointPrefix + '/sign-out')
    }
    return (
        <div>
            <button onClick={signOut} > Sign out </button>
        </div>
    )
}


export { SignOut }
