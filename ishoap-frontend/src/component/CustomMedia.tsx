import { createTheme } from '@mui/material/styles';

// Create a custom theme with overridden breakpoints
export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,  // Overriding the sm breakpoint to 768px
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
