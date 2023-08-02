// components/Footer.jsx
import React from "react";
import { Container, Typography } from '@mui/material';
import { appName } from '../constants/constants.js';

const Footer = () => {
  return (
    <Container component="footer" maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="body1" align="center" style={{ lineHeight: "50px" }}>
        © {new Date().getFullYear()} {appName}. All rights reserved.
      </Typography>
    </Container>    
  );
};

export default Footer;

