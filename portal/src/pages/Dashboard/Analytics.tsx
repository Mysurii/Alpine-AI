import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const data = [ { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
{ name: 'Page B', uv: 412, },
{ name: 'Page C', uv: 354, },
{ name: 'Page D', uv: 321, },
{ name: 'Page E', uv: 321, },
];


function Analytics () {
  return (
    <div className='mt-8'>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart width={400} height={400} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Analytics