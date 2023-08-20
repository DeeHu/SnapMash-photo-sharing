import React, { useState } from 'react';
import { Grid } from '@mui/material';
import SideMenu from './SideMenu';
import ImageDisplay from './ImageDisplay';
import UploadForm from './UploadForm';
import UserPhotos from './UserPhotos';

const Dashboard = () => {
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const handlePhotoUpload = () => {
    setPhotoUploaded(prevState => !prevState);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <SideMenu />
      </Grid>
      <Grid item xs={6}>
        <ImageDisplay />
        <UserPhotos photoUploaded={photoUploaded} />
      </Grid>
      <Grid item xs={3}>
        <UploadForm onPhotoUpload={handlePhotoUpload} />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
