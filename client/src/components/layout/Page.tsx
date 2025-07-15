import { Stack, SxProps } from '@mui/material'
import React from 'react'

const Page = ({children,sx}:{children:React.ReactNode,sx?:SxProps}) => {
  return (
    <Stack minHeight={window.innerHeight} flex={1} sx={{...sx}}>
      {children}
    </Stack>
  )
}

export default Page
