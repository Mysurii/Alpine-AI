import { createTheme } from '@mui/material'
import { PRIMARY, LIGHT, DARK } from '../constants/colors'

const theme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: PRIMARY,
    },
    secondary: {
      main: LIGHT,
    },
    background: {
      default: LIGHT,
      paper: DARK,
    },
  },
})

export const darkTheme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: DARK,
    },
    secondary: {
      main: LIGHT,
    },
    background: {
      default: LIGHT,
      paper: DARK,
    },
    text: {
      primary: LIGHT,
      secondary: LIGHT,
      disabled: LIGHT,
    },
  },
})
export default theme
