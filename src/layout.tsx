import { Outlet } from '@tanstack/react-router';
import { Box, CssBaseline } from '@mui/material';

const Layout = () => {
  return (
    <Box>
      <CssBaseline />
      <Outlet />
    </Box>
  );
};

export default Layout;