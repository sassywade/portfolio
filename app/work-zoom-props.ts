export const zoomable = (label: string) => ({
  "data-work-zoom": "",
  role: "button",
  tabIndex: 0,
  "aria-haspopup": "dialog" as const,
  "aria-label": `Enlarge ${label}`,
});
