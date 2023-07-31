import { ListItem } from '@mui/material'
import styled from '@emotion/styled'
import { PRIMARY } from '../../../constants/colors'

export const Title = styled.h3`
  margin: 20px;
  font-size: 1.4rem;
  color: #fff;
  padding: 20px;
  border-bottom: 2px solid ${PRIMARY};
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`

interface IItemProps {
  isactive: boolean
}

export const StyledListItem = styled(({ isactive, ...props }: any) => <ListItem {...props} />)<IItemProps>`
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
  color: ${(props) => (props.isactive ? 'black' : 'white')};
  background: ${(props) => (props.isactive ? PRIMARY : '')};
  transition: all 0.3s ease;

  .css-10hburv-MuiTypography-root {
    font-weight: ${(props) => (props.isactive ? 'bold' : '')};
    font-size: ${(props) => (props.isactive ? '1.2rem' : '1rem')};
  }

  &:hover {
    transform: ${(props) => (props.isactive ? 'scale(1)' : 'scale(1.1)')};
  }
`

export const ButtonContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  align-items: center;
`
