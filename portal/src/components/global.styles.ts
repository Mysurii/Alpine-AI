import styled from '@emotion/styled'
import { DARKER, LIGHT } from '../constants/colors'

interface IContainer {
  flex?: boolean
  center?: boolean
  bgLight?: boolean
  hasNav?: boolean
}

export const Container = styled('div')<IContainer>`
  background-color: ${(props) => (props.bgLight ? LIGHT : DARKER)};
  height: ${(props) => (props.hasNav ? 'calc(100vh - 60px)' : '100vh')};
  //color: ${LIGHT};
  display: ${(props) => (props.flex ? 'flex' : 'block')};
  align-items: ${(props) => (props.center ? 'center' : 'flex-start')};
  justify-content: ${(props) => (props.center ? 'center' : 'flex-start')};
`

interface IFlex {
  alignEnd?: boolean
  alignCenter?: boolean
  column?: boolean
  justifyBetween?: boolean
  justifyCenter?: boolean
  justifyEnd?: boolean
}

export const Flex = styled('div')<IFlex>`
  display: flex;
  align-items: ${(props) => (props.alignCenter ? 'center' : props.alignEnd ? 'flex-end' : 'flex-start')};
  justify-content: ${(props) => (props.justifyCenter ? 'center' : props.justifyBetween ? 'space-between' : props.justifyEnd ? 'flex-end' : 'flex-start')};
  flex-direction: ${(props) => (props.column ? 'column' : 'row')};
`

export const Grid = styled('div')`
  display: grid;
`

interface ITitle {
  color: string
}

export const Title = styled('h1')<ITitle>`
  color: ${(props) => props.color};
  font-size: 1.6rem;
`

export const SubTitle = styled('h2')<ITitle>`
  color: ${(props) => props.color};
  font-size: 1.2rem;
  margin-bottom: 5vh;
`
