import React, { useState } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const Card4 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const { t } = useTranslation();

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: "ceo", // Unique ID for this card
      title: t("approval5.card4Title"),
      subtitle: t("approval5.card4Description"),
    };
    onSelect(cardData, !selected);
    console.log(
      !selected ? t("approval5.selected") : t("approval5.removed"),
      cardData
    );
  };

  return (
    <InfoCardHeader
      title={t("approval5.card4Title")}
      subtitle={t("approval5.card4Description")}
      buttonText={selected ? t("approval5.remove") : t("approval5.select")}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? "#FFFFFF" : "#827b37"}
      buttonTextColor={selected ? "#827b37" : "#FFFFFF"}
      buttonBorder={selected ? "1px solid #827b37" : "none"}
      onButtonClick={handleToggle}
    />
  );
};

export default Card4;
