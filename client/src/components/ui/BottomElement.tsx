import { Box } from "@mui/material"

interface BottomElementProps {
    children: React.ReactNode,
    top?:number
}
const BottomElement:React.FC<BottomElementProps> = ({
    children,
    top=16
}) => {
  return (
    <Box marginTop={"auto"} width={"100%"}>
        <Box marginTop={`${top}px`}>
            {children}
        </Box>
    </Box>
  )
}

export default BottomElement
