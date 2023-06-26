
import { BiLogoAdobe, BiLogoSteam, BiLogoVisa, BiLogoStripe, BiLogoReddit } from 'react-icons/bi'
import { IoLogoPinterest, IoLogoWhatsapp, IoLogoPlaystation, } from 'react-icons/io'

const brands = [
  BiLogoAdobe,
  BiLogoSteam, BiLogoVisa, BiLogoStripe, BiLogoReddit,
  IoLogoWhatsapp, IoLogoPlaystation, IoLogoPinterest
]

function Brands () {
  return (
    <div className="text-center bg-black text-white p-4 lg:p-12">
      <h3 className='text-2xl font-bold'>Loved by 750+ Awesome Product Teams</h3>



      <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-0 mt-8 lg:mt-24 place-items-center'>
        {brands.map( Brand => <Brand className="text-5xl w-28" /> )}
      </div>
    </div>
  )
}

export default Brands