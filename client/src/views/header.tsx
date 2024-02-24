import { Link } from './link'
import { SignOut } from './sign-out'


const Header = () =>
    <header className='header'>
        <div>
            <nav>
                <ul>
                    <Link to='/sign-up' lab='Sign up' />
                    <Link to='/sign-in' lab='Sign in' />
                </ul>
            </nav>
        </div>
        <SignOut/>
    </header>

export { Header }
