import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import auth from './Login/Firebase-config';
import { Select, MenuItem, Button } from '@mui/material';

const UserPhotos = (props) => {
  const userId = auth.currentUser?.uid;
  const { uid } = useParams();
  const [photoPaths, setPhotoPaths] = useState([]);
  
  useEffect(() => {
    const fetchPhotos = async () => {
      const targetUID = uid || auth.currentUser?.uid; 
      // If you're on a friend's dashboard, it will use the friend's email, otherwise it will use your email.
      // const userId = auth.currentUser?.uid;
      try {
        const response = await axios.get('http://127.0.0.1:5001/get-user-photos', {
          params: {
            target_uid: targetUID, // The UID of the dashboard you're viewing
            current_uid: auth.currentUser?.uid // The UID of the currently logged-in user
            // user_id: userId
          }
        });
        setPhotoPaths(response.data.photos);
      } catch (error) {
        console.error("Error fetching user photos:", error);
      }
    };

    fetchPhotos();
  }, [props.photoUploaded, uid]); // useEffect listens to changes for prop here

  const handleDelete = async (photoId) => {
    try {
      const response = await axios.post('http://127.0.0.1:5001/delete-photo', {
        photo_id: photoId,
        user_id: userId  // send the user id to backend
      });
      if (response.status === 200) {
        setPhotoPaths(prevPaths => prevPaths.filter(path => path.id !== photoId));
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  }

  const handleVisibilityChange = async (photoId, newVisibility) => {
    try {
      const response = await axios.post('http://127.0.0.1:5001/change-photo-visibility', {
        photo_id: photoId,
        visibility: newVisibility
      });
      if (response.status === 200) {
        setPhotoPaths(prevPhotos => 
          prevPhotos.map(photo => 
            photo.id === photoId ? {...photo, Visibility_setting: newVisibility} : photo
          )
        );
      }
    } catch (error) {
      console.error("Error changing photo visibility:", error);
    }
  }
  
  return (
    <div>
      {photoPaths.map(({ path, id, User_ID, Visibility_setting }, index) => {
        if (!path) return null; 
        const imagePath = `http://127.0.0.1:5001/images/${path.split("/").pop()}`;
        return (
          <div key={index}>
            <img src={imagePath} alt="User Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
            {User_ID === userId && (
              // <button onClick={() => handleDelete(id)}>Delete</button>
              <div>
                <Select
                  value={Visibility_setting}
                  onChange={(e) => handleVisibilityChange(id, e.target.value)}
                  variant="outlined"
                  style={{ marginBottom: '10px' }}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Friends">Friends</MenuItem>
                </Select>
                <Button variant="contained" color="error" onClick={() => handleDelete(id)}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserPhotos;
