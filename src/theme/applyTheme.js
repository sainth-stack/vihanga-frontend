export function applyThemeToCssVariables(theme) {
  if (!theme) return;
  const root = document.documentElement;
  try {
    const primaryMain = theme?.primary?.colors?.[0]?.code || "#B8955C";
    const secondaryList = theme?.secondary?.colors || [];
    const getCode = (nameFallback, defaultCode) => {
      const found =
        secondaryList.find((c) =>
          (c?.name || "").toLowerCase() === nameFallback.toLowerCase()
        ) || {};
      return found.code || defaultCode;
    };
    const black = getCode("Black", "#000000");
    const grey = getCode("Grey", "#7B7B7B");
    const white = getCode("White", "#FFFFFF");
    const red = getCode("Red", "#E8502F");
    const green = getCode("Green", "#9DAA45");

    root.style.setProperty("--ts-primary", primaryMain);
    root.style.setProperty("--ts-black", black);
    root.style.setProperty("--ts-grey", grey);
    root.style.setProperty("--ts-white", white);
    root.style.setProperty("--ts-red", red);
    root.style.setProperty("--ts-green", green);
  } catch {
    // ignore theme application errors
  }
}

export function applyThemeFromLocalStorage(companyId) {
  try {
    if (!companyId) return;
    const key = `theme_${companyId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const theme = JSON.parse(raw);
    applyThemeToCssVariables(theme);
  } catch {
    // ignore
  }
}

