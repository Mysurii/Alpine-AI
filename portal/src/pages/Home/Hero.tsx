
import banner from '../../assets/banner.svg'
import Button from '../../components/ui/buttons/Button'
import { BsArrowRightShort } from 'react-icons/bs'
import { AiOutlineDownCircle } from 'react-icons/ai'

const Hero: React.FC = () => {

  const scrollTo = () => {
    const section = document.querySelector( '#example' )
    section?.scrollIntoView( { behavior: 'smooth' } )
  }


  return (
    <section className="flex flex-col justify-center items-center h-screen container relative font-sans mx-auto p-4 text-gray-900 pb-48">
      <div className='px-6 mx-auto max-w-6xl'>
        <div className="flex flex-col-reverse items-center justify-center md:flex-row lg:items-end">
          <div className='pt-24 pr-8 pb-24 text-center items-center md:pb-12 md:w-1/2 md:text-left'>
            <h1 className='text-6xl font-bold font-display'>Your very own virtual assistant.</h1>
            <p className='pt-8 text-lg leading-relaxed text-gray-500 md:max-w-md md:text-xl'>
              Customize your own chatbot and add it to your website.
              <br />
              Without coding.
            </p>
            <Button className='mt-12' rounded rightIcon={BsArrowRightShort}>Try now</Button>
          </div>

          <div className="flex items-end w-1/2 border-b border-gray-400">
            <img src={banner} alt="banner" />
          </div>
        </div>
      </div>

      <AiOutlineDownCircle
        className="absolute bottom-32 text-3xl text-indigo-500 transition duration-150 cursor-pointer hover:scale-105 animate-bounce"
        onClick={scrollTo}
      />

    </section>
  )
}

export default Hero