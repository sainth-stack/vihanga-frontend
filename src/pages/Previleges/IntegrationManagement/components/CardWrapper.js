import { Grid } from '@mui/material'
import React from 'react'

const CardWrapper = ({children, styles}) => {
  return (
    <Grid sx={{...styles, borderRadius: '6px', border: '1px solid rgb(0 0 0 / 8%)'}}>
        {children}
    </Grid>
  )
}

export default CardWrapper