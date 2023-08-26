import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import SideMenu from './SideMenu';
import ImageDisplay from './ImageDisplay';
import UploadForm from './UploadForm';
import UserPhotos from './UserPhotos';
import ManageFriends from './ManageFriends';
import auth from "../Components/Login/Firebase-config";

const Dashboard = () => {
  const { uid } = useParams();
  const isOwnDashboard = !uid || uid === auth.currentUser?.uid;
  const [photoUploaded, setPhotoUploaded] = useState(false);

  console.log("UID from URL:", uid);
  console.log("UID from Firebase:", auth.currentUser?.uid);
  console.log("Is Own Dashboard:", isOwnDashboard);

  const handlePhotoUpload = () => {
    setPhotoUploaded(prevState => !prevState);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <SideMenu />
        <ManageFriends />
      </Grid>
      <Grid item xs={6}>
        <ImageDisplay />
        <UserPhotos photoUploaded={photoUploaded} />
      </Grid>
      <Grid item xs={3}>
        {isOwnDashboard && <UploadForm onPhotoUpload={handlePhotoUpload} />}
      </Grid>
    </Grid>
  );
}

export default Dashboard;
