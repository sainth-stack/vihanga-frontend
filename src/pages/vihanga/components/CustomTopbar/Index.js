// // src/components/CustomTopBar.jsx
// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Box,
//   Typography,
//   IconButton,
//   Avatar,
//   useMediaQuery,
//   Menu,
//   MenuItem,
//   Container,
// } from "@mui/material";
// import logo from "../assets/images/logo.png";
// import { useLocation, useNavigate } from "react-router-dom";
// const CustomTopBar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleClose = (path) => {
//     setAnchorEl(null);

//     console.log("path", path);
//     if (path) navigate(path);
//   };

//   //dropdwon  logic----------------
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   //dropdwon  logic----------------

//   const isMobile = useMediaQuery("(max-width:600px)"); // Mobile

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         backgroundColor: "#fff",
//         boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//         color: "#000",
//         height: "75px",
//         width: "100%",
//         transition: "all 0.3s ease",
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <Container maxWidth="xl">
//         <Toolbar
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             // padding: { },
//           }}
//         >
        

      

//           <>
//             <Box
//               // onMouseEnter={handleClick}
//               // onMouseLeave={() => handleClose(null)}
//               style={{ display: "inline-block" }}
//             >
//               <Avatar
//                 alt="Profile"
//                 src={profile}
//                 sx={{
//                   boxShadow: 2,
//                   marginLeft: ".5rem",
//                   width: "45px",
//                   height: "45px",
//                   cursor: "pointer",
//                   ":hover": {
//                     boxShadow: 2, // Increases shadow on hover
//                     // Slightly enlarges on hover
//                     transition: "all 0.3s ease-in-out", // Smooth transition effect
//                   },
//                 }}
//                 onClick={(event) => {
//                   event.stopPropagation();
//                   handleClick(event);
//                 }}
//               />

//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={() => handleClose(null)}
//                 sx={{ ml: 2 }}
//                 anchorOrigin={{
//                   vertical: "bottom",
//                   horizontal: "center",
//                 }}
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//                 disableScrollLock
//                 disableAutoFocusItem
//               >
//                 <MenuItem onClick={() => handleClose("/brand/impact-claim")}>
//                   Brand
//                 </MenuItem>
//                 <MenuItem onClick={() => handleClose("/story")}>
//                   Cluster
//                 </MenuItem>
//                 <MenuItem onClick={() => handleClose("/")}>Consumer</MenuItem>
//               </Menu>
//             </Box>
//           </>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// };

// export default CustomTopBar;
