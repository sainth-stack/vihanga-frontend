// //birtday-list

import React from "react";
import { Box, Typography } from "@mui/material";
import { CelebrationsListCard } from "../../components/CelebrationsListCard";
import { CelebrationsModal } from "../../components";
import BirthdayWishModal from "./BirthdayWishModal";
import CardWidget from "pages/vihanga/components/Cards/CardWidget";
import { useBirthdayData } from "../../hooks/useBirthdayData";
import { LoadingState, ErrorState, NoDataState } from "../../components/LoadingState";
import { useDispatch } from "react-redux";
import { birthdayWish } from "action/UploadAct";
import { useTranslation } from 'react-i18next';
import maleIcon from "assets/images/male.png";
import femaleIcon from "assets/images/female.png";
export const BirthdayList = () => {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useBirthdayData();
  const [openModal, setOpenModal] = React.useState(false);
  const [wishModalOpen, setWishModalOpen] = React.useState(false);
  const [selectedPerson, setSelectedPerson] = React.useState(null);
  const [sendingWish, setSendingWish] = React.useState(false);
  const dispatch = useDispatch();

  // Show loading state
  if (loading) {
    return <LoadingState title="Loading Birthday List..." height={300} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState 
        title="Failed to Load Birthday List" 
        error={error} 
        onRetry={refetch}
      />
    );
  }

  // Show no data state
  if (!data || !data.birthdays || data.birthdays.length === 0) {
    return (
      <NoDataState 
        title="No Birthdays This Month" 
        message="No employees have birthdays in the current month."
      />
    );
  }

  const { birthdays } = data;

  // Handle opening wish modal
  const handleOpenWishModal = (person) => {
    setSelectedPerson(person);
    setWishModalOpen(true);
  };

  // Handle sending birthday wish
  const handleSendWish = async (wishData) => {
    try {
      setSendingWish(true);
      const data = {
        name: wishData.name,
        description: wishData.description,
        email: wishData.email,
        type: "Birthday",
        senderName: (JSON.parse(localStorage.getItem("user")) || {}).name || ""
      };
      
      const response = await dispatch(birthdayWish(data));
      if (response.success) {
        setWishModalOpen(false);
        setSelectedPerson(null);
        // Optionally refresh the data
        refetch();
      }
    } catch (error) {
      console.error('Error sending birthday wish:', error);
    } finally {
      setSendingWish(false);
    }
  };

  const formatBirthdayDate = (person) => {
    const daysUntil = person.daysUntil || 0;
    if (daysUntil === 0) return t("BirthdayList.DateFormats.Today");
    if (daysUntil === 1) return t("BirthdayList.DateFormats.Tomorrow");
    
    const date = new Date(person.nextOccurrence || person.date);
    const monthName = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    return `${monthName} (${daysUntil} ${t("BirthdayList.DateFormats.Days")})`;
  };

  const birthdayData = birthdays?.slice(0, 4).map((person, index) => {
    const colors = ["#EBBE2E", "#837F39", "#D9534F", "#FF9800", "#009688"];
    const color = colors[index % colors.length];
    
    const personName = person.name || `${person.personalInformation?.firstName || ''} ${person.personalInformation?.lastName || ''}`.trim() || 'Unknown';
    
    return {
      Imgsrc: person.avatar || (person.gender === "Male" ? maleIcon : femaleIcon),
      employeeName: personName,
      eventStatus: formatBirthdayDate(person),
      empNameColor: color,
      CardbackgroundColor: `${color}1A`,
      person: person, // Pass the full person object for wish sending
    };
  });

  return (
    <CardWidget sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "24px",
color: "#0E0E0E"          }}
        >
          {t("BirthdayList.BirthdayList")}
        </Typography>
        {birthdays && birthdays.length > 4 && (
          <Typography 
            variant="body2" 
            sx={{ color: '#836F39', cursor: 'pointer', fontWeight: 600 }} 
            onClick={() => setOpenModal(true)}
          >
            {t("BirthdayList.ViewAll")}
          </Typography>
        )}
      </Box>

      <Box sx={{ mx: 1,mb:2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {birthdayData && birthdayData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("BirthdayList.NoBirthdaysThisMonth")}
            </Typography>
          </Box>
        ) : (
          birthdayData.map((item, index) => (
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
        title={t("BirthdayList.AllUpcomingBirthdays")} 
        items={birthdays} 
        type="birthday"
      />
      
      <BirthdayWishModal
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

export default BirthdayList;
