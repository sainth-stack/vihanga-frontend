import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { getItemFromLocalStorage } from 'utilities/getLocalStorageItem';

const ToggleTabs = ({ onTabChange, selectedTab }) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get("tab");
  
  if(tabFromUrl){
    localStorage.setItem("selectedTab", JSON.stringify({ tab: tabFromUrl }));
  }

  const initialTab = tabFromUrl || selectedTab || (JSON.parse(localStorage.getItem("selectedTab"))?.tab) || "me";
  const [selected, setSelected] = useState(initialTab)

  const privilegesFromLocal = getItemFromLocalStorage("privileges");
  const hasTeamAccess = Array.isArray(privilegesFromLocal) && privilegesFromLocal?.some?.(
    (p) => p && p.page === "Team Level Access" && p.view
  );
  const hasCompanyAccess = Array.isArray(privilegesFromLocal) && privilegesFromLocal?.some?.(
    (p) => p && p.page === "Company Level Access" && p.view
  );
  const hasFunctionalAccess = Array.isArray(privilegesFromLocal) && privilegesFromLocal?.some?.(
    (p) => p && p.page === "Functional Level Access" && p.view
  );

  const handleTabChange = (tab) => {
    setSelected(tab);
    localStorage.setItem("selectedTab", JSON.stringify({ tab }));
    if (onTabChange) {
      onTabChange(tab);
    }
    window.location.reload();
  };

  if (!hasTeamAccess && !hasCompanyAccess && !hasFunctionalAccess) return null;

  return (
    <Box
      display="flex"
      bgcolor="#f8f8f8"
      borderRadius="62px"
      p='4px'
      width="fit-content"
      sx={{
        '@media (max-width: 768px)': {
          p: '2px',
          borderRadius: '50px',
        }
      }}
    >
      <Button
        onClick={() => handleTabChange('me')}
        variant={selected === 'me' ? 'contained' : 'text'}
        sx={{
          backgroundColor: selected === 'me' ? '#837F39' : 'transparent',
          color: selected === 'me' ? '#FFFFFF' : '#837F39',
          borderRadius: '30px',
          textTransform: 'none',
          minWidth: '111px',
          boxShadow: 'none',
          fontWeight: 500,
          fontSize: "16px",
          fontFamily: "Work Sans",
          padding: '6px 16px',
          '&:hover': {
            backgroundColor: selected === 'me' ? '#837F39' : 'transparent',
          },
          '@media (max-width: 768px)': {
            fontSize: '12px',
            minWidth: '70px',
            padding: '4px 8px',
          }
        }}
      >
        Me
      </Button>
      {hasTeamAccess && (
        <Button
          onClick={() => handleTabChange('myteam')}
          variant={selected === 'myteam' ? 'contained' : 'text'}
          sx={{
            backgroundColor: selected === 'myteam' ? '#837F39' : 'transparent',
            color: selected === 'myteam' ? '#FFFFFF' : '#837F39',
            borderRadius: '30px',
            textTransform: 'none',
            minWidth: '111px',
            fontWeight: 500,
            fontSize: "16px",
            fontFamily: "Work Sans",
            padding: '6px 16px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: selected === 'myteam' ? '#7c7b3b' : 'transparent',
            },
            '@media (max-width: 768px)': {
              fontSize: '12px',
              minWidth: '70px',
              padding: '4px 8px',
            }
          }}
        >
          My Team
        </Button>
      )}
            {hasFunctionalAccess && (
        <Button
          onClick={() => handleTabChange('myfunction')}
          variant={selected === 'myfunction' ? 'contained' : 'text'}
          sx={{
            backgroundColor: selected === 'myfunction' ? '#837F39' : 'transparent',
            color: selected === 'myfunction' ? '#FFFFFF' : '#837F39',
            borderRadius: '30px',
            textTransform: 'none',
            minWidth: '111px',
            fontWeight: 500,
            fontSize: "16px",
            fontFamily: "Work Sans",
            padding: '6px 16px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: selected === 'myfunction' ? '#7c7b3b' : 'transparent',
            },
            '@media (max-width: 768px)': {
              fontSize: '12px',
              minWidth: '70px',
              padding: '4px 8px',
            }
          }}
        >
          My Function
        </Button>
      )}
      {hasCompanyAccess && (
        <Button
          onClick={() => handleTabChange('mycompany')}
          variant={selected === 'mycompany' ? 'contained' : 'text'}
          sx={{
            backgroundColor: selected === 'mycompany' ? '#837F39' : 'transparent',
            color: selected === 'mycompany' ? '#FFFFFF' : '#837F39',
            borderRadius: '30px',
            textTransform: 'none',
            minWidth: '111px',
            fontWeight: 500,
            fontSize: "16px",
            fontFamily: "Work Sans",
            padding: '6px 16px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: selected === 'mycompany' ? '#7c7b3b' : 'transparent',
            },
            '@media (max-width: 768px)': {
              fontSize: '12px',
              minWidth: '70px',
              padding: '4px 8px',
            }
          }}
        >
          My Company
        </Button>
      )}

    </Box>
  );
};

export default ToggleTabs;