import withNavbarProvided from '../../components/Navbar/Navbar'
import useAuthStore from '../../stores/auth.store'
import news from '../../assets/news.svg'
import Analytics from './Analytics'

function Dashboard () {
  const { user } = useAuthStore()
  return (
    <div className='container mx-auto p-4'>
      {user && <h3 className='text-md font-bold text-indigo-500 font-display my-4 '>Welcome {user?.name}!</h3>}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className=''>
          <h3 className='text-3xl  font-bold'>
            News
          </h3>
          <ul className='flex flex-col gap-1 p4'>
            <small className='font-bold mb-8'>Version 2.1</small>
            <li>&gt; You can now your have very own chatbot. Keep in mind that the maxiumum amount is capped at 3.</li>
            <li>&gt; You can now customize the looks of your chatbot.</li>
            <li>&gt; Test your chatbot intents by having a conversation with them on the portal!.</li>
            <li>&gt; Train your chatbot</li>
            <li>&gt; Intents are now functioning properly.</li>
            <li>&gt; Chat with chatbot is added in that 'chat with me' section</li>
            <li>&gt; Bug fixes where chat widget did not open.</li>
            <li>&gt; Chatbots are now better trained.</li>
          </ul>
        </div>
        <div className='grid place-items-center'>
          <img src={news} alt="news" className='w-[60%]' />

        </div>
      </div>

      <Analytics />





    </div>
  )
}

const navbarProvided = withNavbarProvided( Dashboard )

export default navbarProvided