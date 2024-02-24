import { NavLink } from 'react-router-dom'


type Props = {
    to: string
    lab: string
}


const Link = ({ to, lab }: Props) =>
    <NavLink
        className={({ isActive }) =>
            'link' + [isActive ? 'link_act' : ''].join(' ')}
        to={to}
    >
        {lab}
    </NavLink>


export { Link }
