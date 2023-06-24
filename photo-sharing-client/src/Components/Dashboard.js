import React from 'react';
import { Grid } from '@mui/material';
import SideMenu from './SideMenu';
import ImageDisplay from './ImageDisplay';
import UploadForm from './UploadForm';

const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <SideMenu />
      </Grid>
      <Grid item xs={6}>
        <ImageDisplay />
      </Grid>
      <Grid item xs={3}>
        <UploadForm />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
