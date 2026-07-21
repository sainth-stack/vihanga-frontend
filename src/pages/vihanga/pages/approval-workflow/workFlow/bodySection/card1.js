import React, { useState } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const Card1 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const { t } = useTranslation(); // ✅ translation hook

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: "line_manager", // Unique ID for the card
      title: t("approval2.card1Title"),
      subtitle: t("approval2.card1Description"),
    };
    onSelect(cardData, !selected); // Pass card data and selection state
    console.log(
      selected ? t("approval2.removed") : t("approval2.selected"),
      cardData
    );
  };

  return (
    <InfoCardHeader
      title={t("approval2.card1Title")}
      subtitle={t("approval2.card1Description")}
      buttonText={selected ? t("approval2.remove") : t("approval2.select")}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? "#FFFFFF" : "#827b37"}
      buttonTextColor={selected ? "#827b37" : "#FFFFFF"}
      buttonBorder={selected ? "1px solid #827b37" : "none"}
      onButtonClick={handleToggle}
    />
  );
};

export default Card1;
