import styled from '@emotion/styled'
import { DARK } from '../../../constants/colors'
import { FiCopy } from 'react-icons/fi'

export const Description = styled.h3`
  margin-top: 20px;
  color: ${DARK};
  font-size: 1.1rem;
`
export const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  max-width: 700px;
  height: auto;
  padding: 10px;
  border: 2px solid lightgray;
  border-radius: 15px;
  font-size: 0.9rem;
  overflow: hidden;
  user-select: none;
`
export const CopyButton = styled(FiCopy)`
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`

export const Explanation = styled.div`
  font-size: 1rem;
  color: ${DARK};
  user-select: none;
`
