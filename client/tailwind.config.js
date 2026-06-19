/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "primary": "#6EA8FE",
        "on-primary": "#111827",
        "primary-container": "#EEF5FF",
        "on-primary-container": "#4D8EF7",
        
        "secondary": "#667085",
        "on-secondary": "#ffffff",
        "secondary-container": "#F5F9FF",
        "on-secondary-container": "#111827",
        
        "tertiary": "#4D8EF7",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#EEF5FF",
        "on-tertiary-container": "#111827",

        "surface": "#FCFDFF",
        "on-surface": "#111827",
        "surface-variant": "#EEF5FF",
        "on-surface-variant": "#667085",
        
        "surface-container-lowest": "#000000",
        "surface-container-low": "#FCFDFF",
        "surface-container": "#F5F9FF",
        "surface-container-high": "#EEF5FF",
        "surface-container-highest": "#DCE8F8",
        
        "outline": "rgba(90,130,180,0.2)",
        "outline-variant": "#DCE8F8",
        
        "error": "#ef4444",
        "on-error": "#ffffff",
        "error-container": "#fee2e2",
        "on-error-container": "#b91c1c",
        
        "background": "#FCFDFF",
        "on-background": "#111827",
        
        "inverse-surface": "#111827",
        "inverse-on-surface": "#FCFDFF",
        "inverse-primary": "#DCE8F8",
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      "spacing": {
        "article-width": "720px",
        "section-padding-lg": "40px",
        "section-padding-sm": "24px",
        "gutter": "32px",
        "max-container": "1440px",
        "sidebar-width": "320px",
      },
      "fontFamily": {
        "display-xl": ['"Helvetica Neue"', "Arial", "sans-serif"],
        "headline-md": ['"Helvetica Neue"', "Arial", "sans-serif"],
        "interface-body": ['"Helvetica Neue"', "Arial", "sans-serif"],
        "article-body": ['"Helvetica Neue"', "Arial", "sans-serif"],
        "label-sm": ['"Helvetica Neue"', "Arial", "sans-serif"],
        "caption": ['"Helvetica Neue"', "Arial", "sans-serif"],
      },
      "fontSize": {
        "display-xl": ["80px", {"lineHeight": "1.05", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "display-xl-mobile": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "headline-lg": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "headline-lg-mobile": ["36px", {"lineHeight": "1.25", "fontWeight": "600"}],
        "headline-md": ["32px", {"lineHeight": "1.3", "fontWeight": "500"}],
        "article-body": ["22px", {"lineHeight": "1.7", "fontWeight": "400"}],
        "interface-body": ["20px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-sm": ["17px", {"lineHeight": "1.4", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "caption": ["16px", {"lineHeight": "1.4", "fontWeight": "400"}]
      },
      "boxShadow": {
        "glass": "0 8px 32px 0 rgba(90, 130, 180, 0.15)",
        "glass-sm": "0 4px 16px 0 rgba(90, 130, 180, 0.1)",
        "primary-glow": "0 0 20px rgba(110, 168, 254, 0.15)",
      },
      "keyframes": {
        "carousel": {
          "0%": { "transform": "translateX(0)" },
          "100%": { "transform": "translateX(calc(-50% - 1rem))" }
        }
      },
      "animation": {
        "carousel": "carousel 25s linear infinite"
      }
    },
  },
  plugins: [],
}
