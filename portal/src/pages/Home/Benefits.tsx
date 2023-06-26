import { FaChartSimple, FaUserClock } from 'react-icons/fa6'
import { BsCodeSlash } from 'react-icons/bs'


const Benefits = () => {
  const features = [
    {
      icon: <BsCodeSlash className="text-xl text-indigo-500" />,
      title: "No code",
      description:
        "The chatbot is easy to customize. Use it by adding only one line of generated code.",
    },
    {
      icon: <FaChartSimple className="text-xl text-indigo-500" />,
      title: "Cheap service",
      description:
        "Many customers have made profit with our chatbot. No need for employees anymore!",
    },
    {
      icon: <FaUserClock className="text-xl text-indigo-500" />,
      title: "24/7 Online",
      description:
        "The chatbot does not stop working. It is always online.",
    },
  ];
  return (
    <div className="bg-indigo-900">
      <div className="py-16 px-6 mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 md:flex-row justify-center">
          {features.map( feature =>
            <div
              className="flex flex-col p-8 space-y-4 bg-white rounded-lg border border-gray-200 transition-shadow duration-500 ease-out cursor-pointer hover:shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <span
                    className="absolute top-0 left-4 w-3 h-3 rounded-full opacity-50 bg-orange"
                  />
                  {feature.icon}
                </div>
                <div className="relative">
                  <h2 className="relative text-xl font-display">{feature.title}</h2>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">{feature.description}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Benefits