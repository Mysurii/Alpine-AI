import { styled, Dialog, TextField } from '@mui/material'
import { LIGHT } from '../../../constants/colors'

export const StyledTextField = styled(TextField)`
  margin-top: 15px;
`
export const StyledForm = styled(Dialog)`
  .MuiDialog-paper > * {
    background-color: ${LIGHT};
  }
`
