import { SubTitle } from '../../components/global.styles'
import { DARK } from '../../constants/colors'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart } from 'recharts'
import { Chart, ChartsContainer } from './analytics-styles'
import IChatbot from 'types/IChatbot'

const colors = ['#1E90FF', '#DC143C', '#008000']

const Analytics = ({ chatbots }: { chatbots: IChatbot[] }): JSX.Element => {
  return (
    <div>
      {typeof chatbots === 'undefined' ? null : (
        <ChartsContainer>
          <Chart>
            <SubTitle color={DARK}>Chatbot usage:</SubTitle>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart width={500} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="value" />
                <Tooltip />
                <Legend />
                {chatbots.map((bot, index) => (
                  <Line dataKey="value" data={bot.usage} stroke={colors[index]} name={bot.name} key={bot.name} type="monotone" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Chart>

          <Chart>
            <SubTitle color={DARK}>Chatbot trained amount:</SubTitle>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chatbots}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amountTrained" fill="#8884d8" type="monotone" name="Amount of times trained" />
              </BarChart>
            </ResponsiveContainer>
          </Chart>
        </ChartsContainer>
      )}
    </div>
  )
}

export default Analytics
