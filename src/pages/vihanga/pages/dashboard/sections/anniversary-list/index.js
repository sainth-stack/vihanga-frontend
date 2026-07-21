// //Anniversary-list

import React from "react";
import { Box, Typography } from "@mui/material";
import { CelebrationsListCard } from "../../components/CelebrationsListCard";
import { CelebrationsModal } from "../../components";
import CardWidget from "pages/vihanga/components/Cards/CardWidget";
import { useBirthdayData } from "../../hooks/useBirthdayData";
import { LoadingState, ErrorState, NoDataState } from "../../components/LoadingState";
import { useDispatch } from "react-redux";
import { birthdayWish } from "action/UploadAct";
import AnniversaryWishModal from "./AnniversaryWishModal";
import { useTranslation } from 'react-i18next';
import maleIcon from "assets/images/male.png";
import femaleIcon from "assets/images/female.png";
export const AnniversaryList = () => {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useBirthdayData();
  const [openModal, setOpenModal] = React.useState(false);
  const [wishModalOpen, setWishModalOpen] = React.useState(false);
  const [selectedPerson, setSelectedPerson] = React.useState(null);
  const [sendingWish, setSendingWish] = React.useState(false);
  const dispatch = useDispatch();

  // Debug: Log the data to see what we're getting
  console.log('AnniversaryList - Full data:', data);
  console.log('AnniversaryList - Anniversaries:', data?.anniversaries);

  // Show loading state
  if (loading) {
    return <LoadingState title="Loading Anniversary List..." height={300} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState 
        title="Failed to Load Anniversary List" 
        error={error} 
        onRetry={refetch}
      />
    );
  }

  // Show no data state
  if (!data || !data.anniversaries || data.anniversaries.length === 0) {
    return (
      <NoDataState 
        title="No Anniversaries This Month" 
        message="No employees have work anniversaries in the current month."
      />
    );
  }

  const { anniversaries } = data;

  // Handle opening wish modal
  const handleOpenWishModal = (person) => {
    setSelectedPerson(person);
    setWishModalOpen(true);
  };

  // Handle sending anniversary wish
  const handleSendWish = async (wishData) => {
    try {
      setSendingWish(true);
      const data = {
        name: wishData.name,
        description: wishData.description,
        email: wishData.email,
        type: "Anniversary",
        senderName: (JSON.parse(localStorage.getItem("user")) || {}).name || ""
      };
      console.log('AnniversaryList - dispatching payload:', data);
      
      const response = await dispatch(birthdayWish(data));
      console.log('AnniversaryList - API response:', response);
      if (response.success) {
        setWishModalOpen(false);
        setSelectedPerson(null);
        // Optionally refresh the data
        refetch();
      }
    } catch (error) {
      console.error('Error sending anniversary wish:', error);
    } finally {
      setSendingWish(false);
    }
  };

  const formatAnniversaryDate = (person) => {
    const daysUntil = person.daysUntil || 0;
    const yearsOfService = person.yearsOfService || 0;
    
    const yearText = yearsOfService !== 1 ? t("AnniversaryList.DateFormats.Years") : t("AnniversaryList.DateFormats.Year");
    
    if (daysUntil === 0) return `${yearsOfService} ${yearText} - ${t("AnniversaryList.DateFormats.Today")}`;
    if (daysUntil === 1) return `${yearsOfService} ${yearText} - ${t("AnniversaryList.DateFormats.Tomorrow")}`;
    
    const date = new Date(person.nextOccurrence || person.date);
    const monthName = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    return `${yearsOfService} ${yearText} - ${monthName} (${daysUntil} ${t("AnniversaryList.DateFormats.Days")})`;
  };

  // Show all anniversaries instead of limiting to 4
  const anniversaryData = anniversaries.map((person, index) => {
    const colors = ["#EBBE2E", "#837F39", "#D9534F", "#FF9800", "#009688"];
    const color = colors[index % colors.length];
    
    const personName = person.name || `${person.personalInformation?.firstName || ''} ${person.personalInformation?.lastName || ''}`.trim() || 'Unknown';
    
    return {
      Imgsrc: person.avatar || (person.gender === "Male" ? maleIcon : femaleIcon),
      employeeName: personName,
      eventStatus: formatAnniversaryDate(person),
      empNameColor: color,
      CardbackgroundColor: `${color}1A`,
      person: person, // Pass the full person object for wish sending
    };
  });

  return (
    <CardWidget>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "24px",
          }}
        >
          {t("AnniversaryList.AnniversaryList")} ({anniversaries.length})
        </Typography>
        {anniversaries && anniversaries.length > 4 && (
          <Typography 
            variant="body2" 
            sx={{ color: '#836F39', cursor: 'pointer', fontWeight: 600 }} 
            onClick={() => setOpenModal(true)}
          >
            {t("AnniversaryList.ViewAll")}
          </Typography>
        )}
      </Box>

      <Box sx={{ mx: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {anniversaryData && anniversaryData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("AnniversaryList.NoAnniversariesThisMonth")}
            </Typography>
          </Box>
        ) : (
          anniversaryData.map((item, index) => (
            <CelebrationsListCard
              key={index}
              Imgsrc={item.Imgsrc}
              employeeName={item.employeeName}
              eventStatus={item.eventStatus}
              empNameColor={item.empNameColor}
              CardbackgroundColor={item.CardbackgroundColor}
              onSendWish={() => handleOpenWishModal(item.person)}
            />
          ))
        )}
      </Box>

      <CelebrationsModal 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        title={t("AnniversaryList.AllUpcomingAnniversaries")} 
        items={anniversaries} 
        type="anniversary"
      />
      
      <AnniversaryWishModal
        open={wishModalOpen}
        onClose={() => {
          setWishModalOpen(false);
          setSelectedPerson(null);
        }}
        person={selectedPerson}
        onSendWish={handleSendWish}
        loading={sendingWish}
      />
    </CardWidget>
  );
};

export default AnniversaryList;

