import React, { useState } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const Card6 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const { t } = useTranslation();

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: "project_manager", // Unique ID for this card
      title: t("approval7.card6Title"),
      subtitle: t("approval7.card6Description"),
    };
    onSelect(cardData, !selected);
    console.log(
      !selected ? t("approval7.selected") : t("approval7.removed"),
      cardData
    );
  };

  return (
    <InfoCardHeader
      title={t("approval7.card6Title")}
      subtitle={t("approval7.card6Description")}
      buttonText={selected ? t("approval7.remove") : t("approval7.select")}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? "#FFFFFF" : "#827b37"}
      buttonTextColor={selected ? "#827b37" : "#FFFFFF"}
      buttonBorder={selected ? "1px solid #827b37" : "none"}
      onButtonClick={handleToggle}
    />
  );
};

export default Card6;
