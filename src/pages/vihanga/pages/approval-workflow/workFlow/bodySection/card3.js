import React, { useState } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const Card3 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const { t } = useTranslation(); // ✅ for translations

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: "dept_head", // ✅ unique ID
      title: t("approval4.card3Title"),
      subtitle: t("approval4.card3Description"),
    };
    onSelect(cardData, !selected);
    console.log(
      !selected ? t("approval4.selected") : t("approval4.removed"),
      cardData
    );
  };

  return (
    <InfoCardHeader
      title={t("approval4.card3Title")}
      subtitle={t("approval4.card3Description")}
      buttonText={selected ? t("approval4.remove") : t("approval4.select")}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? "#FFFFFF" : "#827b37"}
      buttonTextColor={selected ? "#827b37" : "#FFFFFF"}
      buttonBorder={selected ? "1px solid #827b37" : "none"}
      onButtonClick={handleToggle}
    />
  );
};

export default Card3;
