
import { BiLogoAdobe, BiLogoSteam, BiLogoVisa, BiLogoStripe, BiLogoReddit } from 'react-icons/bi'
import { IoLogoPinterest, IoLogoAngular, IoLogoFacebook, IoLogoWhatsapp, IoLogoPlaystation, IoLogoApple, IoLogoDribbble } from 'react-icons/io'


function Brands () {
  return (
    <div className="text-center mx-auto bg-indigo-900 text-white p-12">
      <h3 className='text-2xl font-bold'>Loved by 750+ Awesome Product Teams</h3>
      <div className='w-full grid grid-cols-4 gap-8 place-items-center mt-12 flex-nowrap max-w-2xl mx-auto'>
        <BiLogoAdobe className="text-5xl" />
        <BiLogoSteam className="text-5xl" />
        <BiLogoVisa className="text-5xl" />
        <BiLogoStripe className="text-5xl" />
        <IoLogoPinterest className="text-5xl" />
        <IoLogoPlaystation className="text-5xl" />
        <IoLogoFacebook className="text-5xl" />
        <IoLogoWhatsapp className="text-5xl" />

      </div>
    </div>
  )
}

export default Brands