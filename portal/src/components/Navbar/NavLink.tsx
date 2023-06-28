import { Link, useMatch, useResolvedPath } from 'react-router-dom';

interface IProps {
  to: string
  name: string
}


const NavLink: React.FC<IProps> = ( { to, name } ) => {
  const resolved = useResolvedPath( to );
  const match = useMatch( { path: resolved.pathname, end: true } );

  return (
    <Link to={to} className={`${ match ? 'font-semibold text-indigo-600 hover:text-indigo-800' : '' }`} >
      {name}
    </Link>
  )
}

export default NavLink