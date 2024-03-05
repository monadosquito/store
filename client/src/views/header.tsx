import { Link } from './link'
import { SignOut } from './sign-out'


const Header = () =>
    <header className='header'>
        <nav>
            <ul className='header__links'>
                <Link to='/product/all' lab='Products' />
            </ul>
        </nav>
        <div className='header__sub'>
            <nav>
                <ul className='header__links'>
                    <Link to='/sign-up' lab='Sign up' />
                    <Link to='/sign-in' lab='Sign in' />
                </ul>
            </nav>
            <SignOut/>
        </div>
    </header>

export { Header }
