// for birthdaylist and Anniversary list in in dashboard

import { Box, Typography } from "@mui/material"
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export const CelebrationsListCard = ({
  Imgsrc="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
 employeeName = "",
 empNameColor="",
  empFontSize = 18,
  eventStatus = "",
  eventStatusSize = 14,
   eventStatusColor="#707070",
     CardbackgroundColor= "",
     onSendWish = null

}) => {
  return (


    <Box sx={{
       borderRadius: "20px",
        opacity: 1,
        padding: "20px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb:1,
        backgroundColor: CardbackgroundColor || "707070" // 

    }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>

<Box
  component="img"
  src={Imgsrc}
  alt="Img"
  sx={{
    width: "30px",
    height: "30px",
    opacity: 1,
    borderRadius: "50%",
     objectFit: "cover",
  }}
/>
     <Box>
          <Typography
            sx={{
              fontFamily: "Work Sans, sans-serif",
              fontSize: empFontSize,
              fontWeight: 500,
              color:empNameColor
            }}
          >
            {employeeName}
          </Typography>
          <Typography sx={{ color: eventStatusColor, fontSize: eventStatusSize }}>
            {eventStatus}
          </Typography>
        </Box>
        </Box>
      <ChatBubbleOutlineIcon 
        style={{ 
          fontSize: 30,
          color: empNameColor,
          cursor: onSendWish ? 'pointer' : 'default'
        }}
        onClick={onSendWish}
      />      
</Box>
  )
}
