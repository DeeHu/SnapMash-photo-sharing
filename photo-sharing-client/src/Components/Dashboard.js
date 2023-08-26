import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import SideMenu from './SideMenu';
import ImageDisplay from './ImageDisplay';
import UploadForm from './UploadForm';
import UserPhotos from './UserPhotos';
import ManageFriends from './ManageFriends';
import axios from "axios";
import auth from "../Components/Login/Firebase-config";

const Dashboard = () => {
  const { uid } = useParams();
  const isOwnDashboard = !uid || uid === auth.currentUser?.uid;
  const [userName, setUserName] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/user/${auth.currentUser?.uid}`);
        setUserName(response.data.User_name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    }
    if (auth.currentUser) {
      fetchUserName();
    }
  }, [auth.currentUser]);
  

  const handlePhotoUpload = () => {
    setPhotoUploaded(prevState => !prevState);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        {isOwnDashboard && <h2>Hi, {userName}!</h2>}
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
