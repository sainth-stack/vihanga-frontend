import { getItemFromLocalStorage } from './getLocalStorageItem';


export const getThemeColors = () => {
  const companyId = getItemFromLocalStorage("companyId");
  const themeKey = `theme_${companyId}`;
  const colortheme = getItemFromLocalStorage(themeKey);

  const primaryColor = colortheme?.primary?.colors[0]?.code || "#BEA781";
  
  const secondaryColors = {
    black: colortheme?.secondary?.colors?.find(c => c.name === "Black")?.code || "#000000",
    grey: colortheme?.secondary?.colors?.find(c => c.name === "Grey")?.code || "#7B7B7B",
    white: colortheme?.secondary?.colors?.find(c => c.name === "White")?.code || "#FFFFFF",
    red: colortheme?.secondary?.colors?.find(c => c.name === "Red")?.code || "#E8502F",
    green: colortheme?.secondary?.colors?.find(c => c.name === "Green")?.code || "#9DAA45"
  };

  return {
    primaryColor,
    secondaryColors
  };
};


export const getPrimaryColor = () => {
  return getThemeColors().primaryColor;
};

// Get only secondary colors
 
export const getSecondaryColors = () => {
  return getThemeColors().secondaryColors;
};