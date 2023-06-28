import { useNavigate } from "react-router-dom"
import useAuthStore from "../../stores/auth.store"
import NavLink from "./NavLink"

const links = [
  {
    name: 'Customize',
    path: '/customize'
  },
  {
    name: 'Intents',
    path: '/intents'
  }
]

const Navbar = () => {
  const { user, logoutUser } = useAuthStore()
  const navigate = useNavigate()

  const logout = async () => {
    await logoutUser()
    navigate( '/' )
  }

  const nav = (): JSX.Element => (
    <nav className='space-x-10'>
      {links.map( link => <NavLink to={link.path} name={link.name} /> )}
      <a onClick={logout} className="cursor-pointer">Log out</a>
    </nav>
  )

  return (
    <div className='container mx-auto flex justify-between p-4 border-b border-gray-300'>
      <h3 className='text-xl font-bold cursor-pointer transition duration-150 hover:text-indigo-600'>alpine</h3>
      {nav()}
    </div>
  )
}


const withNavbarProvided = ( Component: React.ComponentType ) => {
  return function NavbarProvided ( props: any ): JSX.Element {
    return (
      <>
        <Navbar />
        <Component {...props} />
      </>
    )
  }
}

export default withNavbarProvided
