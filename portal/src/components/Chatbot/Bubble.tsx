import clsxm from "../../lib/clsxm"

interface IProps {
  text: string
  date: Date
  isBot?: boolean,
  button?: boolean
}

function Bubble ( { text, date, isBot }: IProps ) {
  return (
    <div className={clsxm( "flex flex-col mt-3", [
      !isBot && 'items-end'
    ] )}>
      <div className={clsxm( 'flex min-w-[75px] w-fit p-2 rounded-lg', [
        isBot && 'text-left rounded-bl-none bg-gray-400 text-white',
        !isBot && 'text-right rounded-br-none bg-indigo-500 text-white'
      ] )}>{text}</div>
      <span className="text-neutral-300 text-sm">
        {date.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } )}
      </span>
    </div>
  )
}

export default Bubble