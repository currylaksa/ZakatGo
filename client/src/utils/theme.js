/**
 * Global theme configuration
 * Use these variables throughout the app for consistent styling
 */

const theme = {
  colors: {
    primary: "#04364A",    // Main brand color - dark blue
    secondary: "#176B87",  // Secondary color - blue
    tertiary: "#176B87",   // Tertiary color - blue
    neutral: "#f8f7f3",    // Background color
    
    // Variations for different states or emphasis
    primaryHover: "#03293A",
    primaryLight: "#E6EEF0",
    secondaryLight: "#2685A3",
    
    // Semantic colors
    success: "#176B87",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  
  // Reusable button styles
  buttons: {
    primary: "bg-primary hover:bg-primaryHover text-white",
    secondary: "bg-secondary hover:bg-secondaryLight text-white",
    tertiary: "bg-tertiary hover:bg-secondaryLight text-white",
    outline: "bg-transparent border border-primary text-primary hover:bg-primaryLight",
    text: "bg-transparent text-primary hover:text-primaryHover underline",
  },
  
  // Border styles
  borderRadius: {
    small: "rounded",
    medium: "rounded-lg",
    large: "rounded-xl",
    full: "rounded-full",
  },
  
  // Spacing
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  }
};

export default theme; 