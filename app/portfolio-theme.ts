export const PORTFOLIO_THEME_STORAGE_KEY = "neel-portfolio-theme";

export const PORTFOLIO_THEME_BOOT_SCRIPT = `(() => {
  try {
    const theme = window.localStorage.getItem("${PORTFOLIO_THEME_STORAGE_KEY}");
    if (theme === "dark" || theme === "light") {
      document.documentElement.dataset.portfolioTheme = theme;
    }
  } catch {}
})();`;
