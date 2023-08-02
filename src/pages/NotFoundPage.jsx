// pages/NotFoundPage.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const NotFoundPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"      
      padding={3}
      textAlign="center"
      bgcolor="#f0f0f0"
    >
      <Typography variant="h5" component="h1" gutterBottom color="primary">
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        Oops! The page you are looking for does not exist.
      </Typography>      
    </Box>
  );
};

export default NotFoundPage;
