import React from 'react';
import { Box, InputBase, Avatar, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../../../assets/svg/websiteName.svg';
// import profile from '../../../../assets/svg/nabvbarProfile.svg'
import notification from '../../../../assets/svg/notificationIcon.svg'
const devProfile = require('../../../../assets/svg/dev-placeholder.svg');
const isDev = process.env.NODE_ENV === 'development';
const NavbarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 88,
  backgroundColor: '#FBFDFC',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 32px',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
  gap: '32px',
}));

const SearchBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #BEA881',
    borderRadius: 24,
    padding: '4px 16px',
    width: '100%',
    minWidth: 200,
  
    [theme.breakpoints.up('lg')]: {
      minWidth: 525,
      maxWidth: 525,
    },
  }));
  

const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: '6px 8px',
}));

const LogoSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}));

export default function Navbar() {
  return (
    <NavbarContainer>
      <LogoSection>
        {/* <img src="/logo.png" alt="Logo" height={48} /> */}
        <Box>
          <img src={logo} alt="Vihanga Text" sx={{height:"48px",width:"215"}} />
        </Box>
      </LogoSection>

      <Box display="flex" alignItems="center" gap={3}>
        <SearchBox>
          <SearchInput placeholder="Search" />
          <SearchIcon style={{ color: '837F39' }} />
        </SearchBox>

        <IconButton>
          <img src={notification} alt='notification' style={{ color: '#837F39',width:"17px",height:"20px" }} />
        </IconButton>

        {/* <Avatar src={isDev ? devProfile : profile} alt="User"  /> */}
      </Box>
    </NavbarContainer>
  );
}
