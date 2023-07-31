import Chatbot from './Chatbot'
import { render, screen } from '../../utils/test-utils'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Tests

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
describe('Renders main page correctly', () => {
  // Setup
  it('chatbot name is visible', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Chatbot _id={'8e89c250-cb20-4569-983e-0f80e9400f92'} description={'hello'} name={'chatbot123'} index={0} refetchFn={() => undefined} />
        </BrowserRouter>
      </QueryClientProvider>,
    )
    expect(screen.getByText('My name is chatbot123 and I am here to help!')).toBeInTheDocument()
  })
})
