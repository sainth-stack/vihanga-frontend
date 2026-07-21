import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CakeIcon from '@mui/icons-material/Cake';
import { useTranslation } from 'react-i18next';

export default function BirthdayWishModal({ 
  open, 
  onClose, 
  person = null,
  onSendWish = null,
  loading = false
}) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (onSendWish && person) {
      const personName = person.name || `${person.personalInformation?.firstName || ''} ${person.personalInformation?.lastName || ''}`.trim();
      console.log(person,'person')
      const personEmail = person.email || person.contactInformation?.email;
      
      onSendWish({
        ...person,
        name: personName,
        email: personEmail,
        description: message || `Happy Birthday ${personName}!`
      });
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  if (!person) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #F0F0F0',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        p: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CakeIcon sx={{ color: '#837F39' }} />
          <Typography variant="h6" fontWeight={700} color="#0E0E0E" fontFamily="Work Sans">
            {t("BirthdayWishModal.SendBirthdayWish")}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ bgcolor: '#FFFFFF', pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar 
            src={person.avatar} 
            sx={{ 
              width: 64, 
              height: 64,
              bgcolor: '#F3F2E8'
            }}
          >
            {person.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600} fontFamily="Work Sans" color="#0E0E0E">
              {person.name || `${person.personalInformation?.firstName || ''} ${person.personalInformation?.lastName || ''}`.trim()}
            </Typography>
            <Typography variant="body2" color="#707070" fontFamily="Work Sans">
              {person.email || person.contactInformation?.email || 'N/A'}
            </Typography>
            
          </Box>
        </Box>

        <Typography variant="body2" color="#707070" fontFamily="Work Sans" sx={{ mb: 2 }}>
          {t("BirthdayWishModal.SendPersonalizedMessage")} {person.name || `${person.personalInformation?.firstName || ''} ${person.personalInformation?.lastName || ''}`.trim()}:
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder={`${t("BirthdayWishModal.HappyBirthdayPlaceholder")} ${person.name || `${person.personalInformation?.firstName || ''} ${person.personalInformation?.lastName || ''}`.trim()}! 🎉`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#EAEAEA',
              },
              '&:hover fieldset': {
                borderColor: '#CFCFCF',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#837F39',
              },
            },
          }}
        />
      </DialogContent>
      
      <DialogActions sx={{ bgcolor: '#FFFFFF', p: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ 
            borderColor: '#837F39', 
            color: '#837F39',
            '&:hover': {
              borderColor: '#7c7b3b',
              backgroundColor: '#F8F8F8'
            }
          }}
        >
          {t("BirthdayWishModal.Cancel")}
        </Button>
        <Button 
          onClick={handleSend} 
          variant="contained"
          disabled={loading}
          sx={{ 
            bgcolor: '#837F39',
            '&:hover': {
              bgcolor: '#7c7b3b'
            },
            '&:disabled': {
              bgcolor: '#C0BF9E'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: '#FFF' }} />
          ) : (
            t("BirthdayWishModal.SendWish")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 