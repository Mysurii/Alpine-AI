
import banner from '../../assets/banner.svg'
import Button from '../../components/ui/buttons/Button'
import { AiOutlineRight } from 'react-icons/ai'
import { BsFillBriefcaseFill } from 'react-icons/bs'

const Hero: React.FC = () => {

  return (
    <section className="container font-sans mx-auto p-4 text-gray-900 mb-12">
      <div className='flex justify-between'>
        <h3 className='text-xl font-bold'>alpine</h3>
        <nav className='space-x-10'>
          <a href="/login">Log in</a>
          <a href="/" className='font-semibold text-indigo-600 hover:text-indigo-800'>Try now</a>
        </nav>
      </div>

      <div className='px-6 mx-auto max-w-6xl mt-24'>
        <div className="flex flex-col-reverse items-center justify-center md:flex-row lg:items-end">
          <div className='pt-24 pr-8 pb-24 text-center items-center md:pb-12 md:w-1/2 md:text-left'>
            <h1 className='text-6xl font-bold font-display'>Your very own virtual assistant.</h1>
            <p className='pt-8 text-lg leading-relaxed text-gray-500 md:max-w-md md:text-xl'>
              Customize your own chatbot and add it to your website.
              <br />
              Without coding.
            </p>
            <Button className='mt-12' rounded rightIcon={AiOutlineRight}>Try now</Button>
          </div>

          <div className="flex items-end w-1/2 border-b border-gray-400">
            <img src={banner} alt="banner" />
          </div>
        </div>
      </div>



    </section>
  )
}

export default Hero