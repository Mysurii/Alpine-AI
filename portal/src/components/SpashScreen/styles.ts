import styled from '@emotion/styled'
import { DARK, PRIMARY } from '../../constants/colors'

export const Cover = styled.div`
  background: ${DARK};
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0;
  animation: fade-out 4s;
  z-index: 0;

  @keyframes fade-out {
    0%,
    85% {
      display: block;
      opacity: 1;
      z-index: 9999;
    }
    100% {
      opacity: 0;
      display: block;
      z-index: 0;
    }
  }
`

export const Text = styled.h1`
  color: ${PRIMARY};
  font-size: 5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: zoom 2s;
  animation-delay: 2s;

  @keyframes zoom {
    50% {
      font-size: 5rem;
    }
    60% {
      font-size: calc(5rem * 0.9);
    }
    100% {
      font-size: 100rem;
    }
  }
`
