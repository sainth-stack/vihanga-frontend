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
import WorkIcon from '@mui/icons-material/Work';
import { useTranslation } from 'react-i18next';

export default function AnniversaryWishModal({ 
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
      const personEmail = person.email || person.contactInformation?.email;
      const yearsOfService = person.yearsOfService || 0;
      const payload = {
        ...person,
        name: personName,
        email: personEmail,
        description: message || `Congratulations on ${yearsOfService} year${yearsOfService !== 1 ? 's' : ''} of service, ${personName}!`
      };
      console.log('AnniversaryWishModal - person:', person);
      console.log('AnniversaryWishModal - payload to send:', payload);
      onSendWish(payload);
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  if (!person) return null;

  const yearsOfService = person.yearsOfService || 0;

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
          <WorkIcon sx={{ color: '#837F39' }} />
          <Typography variant="h6" fontWeight={700} color="#0E0E0E" fontFamily="Work Sans">
            {t("AnniversaryWishModal.SendAnniversaryWish")}
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
            <Typography variant="caption" color="#707070" fontFamily="Work Sans">
              {person.department || ''}
            </Typography>
            <Typography variant="caption" color="#707070" fontFamily="Work Sans" display="block">
              {yearsOfService} {yearsOfService !== 1 ? t("AnniversaryWishModal.YearsOfServicePlural") : t("AnniversaryWishModal.YearsOfService")}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="#707070" fontFamily="Work Sans" sx={{ mb: 2 }}>
          {t("AnniversaryWishModal.SendPersonalizedMessage")} {person.name || `${person.personalInformation?.firstName || ''} ${person.personalInformation?.lastName || ''}`.trim()}:
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder={`${t("AnniversaryWishModal.CongratulationsPlaceholder")} ${yearsOfService} ${yearsOfService !== 1 ? t("AnniversaryWishModal.YearsOfServicePlural") : t("AnniversaryWishModal.YearsOfService")}, ${person.name || `${person.personalInformation?.firstName || ''} ${person.personalInformation?.lastName || ''}`.trim()}! 🎉`}
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
          {t("AnniversaryWishModal.Cancel")}
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
            t("AnniversaryWishModal.SendWish")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 