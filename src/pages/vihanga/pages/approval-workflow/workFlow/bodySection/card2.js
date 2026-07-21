import React, { useState } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const Card2 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const { t } = useTranslation(); // ✅ translation hook

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: "hr_manager", // ✅ unique ID for this card
      title: t("approval3.card2Title"),
      subtitle: t("approval3.card2Description"),
    };
    onSelect(cardData, !selected);
    console.log(
      !selected ? t("approval3.selected") : t("approval3.removed"),
      cardData
    );
  };

  return (
    <InfoCardHeader
      title={t("approval3.card2Title")}
      subtitle={t("approval3.card2Description")}
      buttonText={selected ? t("approval3.remove") : t("approval3.select")}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? "#FFFFFF" : "#827b37"}
      buttonTextColor={selected ? "#827b37" : "#FFFFFF"}
      buttonBorder={selected ? "1px solid #827b37" : "none"}
      onButtonClick={handleToggle}
    />
  );
};

export default Card2;
