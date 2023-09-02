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
import TagPresetForm from './TagPresetForm';

const Dashboard = () => {
  const { uid } = useParams();
  const isOwnDashboard = !uid || uid === auth.currentUser?.uid;
  const [userName, setUserName] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [fetchedPresets, setFetchedPresets] = useState([]);

  const fetchPresets = async () => {
    const userId = auth.currentUser?.uid;
    try {
      const response = await axios.get(`http://127.0.0.1:5001/get-user-tag-presets?user_id=${userId}`);
      setFetchedPresets(response.data.tagPresets);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch tag presets.');
    }
  };

  const updateFetchedPresets = (newPresets) => {
    setFetchedPresets(newPresets);
  };

  useEffect(() => {
    const userIdToFetch = uid || auth.currentUser?.uid;
    const fetchUserName = async (userIdToFetch) => {
      try {
        // const response = await axios.get(`http://127.0.0.1:5001/user/${auth.currentUser?.uid}`);
        const response = await axios.get(`http://127.0.0.1:5001/user/${userIdToFetch}`);
        setUserName(response.data.User_name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    }
    if (auth.currentUser || uid) {
      fetchUserName(userIdToFetch);
      fetchPresets();
    }
  }, [uid, auth.currentUser]);
  

  const handlePhotoUpload = () => {
    setPhotoUploaded(prevState => !prevState);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        {isOwnDashboard ? <h2>Hi, {userName}!</h2> : <h2>{userName}'s gallery</h2>}
        <SideMenu />
        {isOwnDashboard && <ManageFriends />}
      </Grid>
      <Grid item xs={6}>
        <ImageDisplay />
        <UserPhotos photoUploaded={photoUploaded} />
      </Grid>
      <Grid item xs={3}>
        {isOwnDashboard && <UploadForm onPhotoUpload={handlePhotoUpload} presets={fetchedPresets} updateFetchedPresets={updateFetchedPresets} />}
        {isOwnDashboard && <TagPresetForm tagPresets={fetchedPresets} setTagPresets={setFetchedPresets} fetchPresets={fetchPresets} />}
      </Grid>
    </Grid>
  );
}

export default Dashboard;
