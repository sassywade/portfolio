export const PORTFOLIO_THEME_STORAGE_KEY = "neel-portfolio-theme";

export const PORTFOLIO_THEME_BOOT_SCRIPT = `(() => {
  try {
    window.localStorage.removeItem("${PORTFOLIO_THEME_STORAGE_KEY}");
  } catch {}
  document.documentElement.dataset.portfolioTheme = "light";
})();`;
