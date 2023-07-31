import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const data = [
  { name: '22 jul', uv: 478 },
  { name: '23 jul', uv: 612, },
  { name: '24 jul', uv: 486, },
  { name: '25 jul', uv: 613, },
  { name: '26 jul', uv: 323, },
];


function Analytics () {
  return (
    <div className='mt-8'>
      <ResponsiveContainer width="100%" height={350}>
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