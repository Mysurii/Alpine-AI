import Benefits from "./Benefits"
import Brands from "./Brands"
import Example from "./Example"
import Hero from "./Hero"
import Operation from "./Operation"
import Tryout from "./Tryout"

const Home = () => {

  return (
    <>
      <div className='container mx-auto flex justify-between p-4'>
        <h3 className='text-xl font-bold cursor-pointer transition duration-150 hover:text-indigo-600'>alpine</h3>
        <nav className='space-x-10'>
          <a href="/login">Log in</a>
          <a href="/" className='font-semibold text-indigo-600 hover:text-indigo-800'>Try now</a>
        </nav>
      </div>
      <Hero />
      <Brands />
      <Example />
      <Benefits />
      <Operation />
      <Tryout />
    </>
  )
}

export default Home