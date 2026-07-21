import React, { useState } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const Card5 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const { t } = useTranslation();

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: "finance_director", // Unique ID for this card
      title: t("approval6.card5Title"),
      subtitle: t("approval6.card5Description"),
    };
    onSelect(cardData, !selected);
    console.log(
      !selected ? t("approval6.selected") : t("approval6.removed"),
      cardData
    );
  };

  return (
    <InfoCardHeader
      title={t("approval6.card5Title")}
      subtitle={t("approval6.card5Description")}
      buttonText={selected ? t("approval6.remove") : t("approval6.select")}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? "#FFFFFF" : "#827b37"}
      buttonTextColor={selected ? "#827b37" : "#FFFFFF"}
      buttonBorder={selected ? "1px solid #827b37" : "none"}
      onButtonClick={handleToggle}
    />
  );
};

export default Card5;
