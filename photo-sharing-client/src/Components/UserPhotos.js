import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import auth from './Login/Firebase-config';
import { Select, MenuItem, Button, TextField } from '@mui/material';

const UserPhotos = (props) => {
  const userId = auth.currentUser?.uid;
  const { uid } = useParams();
  const [photoPaths, setPhotoPaths] = useState([]);
  const [tagMap, setTagMap] = useState({});
  
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

  const handleAddTag = async (photoId, newTag) => {
    try {
      const response = await axios.post('http://127.0.0.1:5001/add-tag', {
        photo_id: photoId,
        tag: newTag
      });
      if (response.status === 200) {
        setPhotoPaths(prevPhotos => 
          prevPhotos.map(photo => 
            photo.id === photoId ? {...photo, tags: [...photo.tags, newTag]} : photo
          )
        );
        setTagMap(prevTagMap => ({ ...prevTagMap, [photoId]: '' }));
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleDeleteTag = async (photoId, tag) => {
    try {
      const response = await axios.post('http://127.0.0.1:5001/delete-tag', {
        photo_id: photoId,
        tag
      });
      if (response.status === 200) {
        setPhotoPaths(prevPhotos =>
          prevPhotos.map(photo => 
            photo.id === photoId ? {...photo, tags: photo.tags.filter(t => t !== tag)} : photo
          )
        );
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };
  
  return (
    <div>
      {photoPaths.map(({ path, id, User_ID, Visibility_setting, tags }, index) => {
        if (!path) return null; 
        const imagePath = `http://127.0.0.1:5001/images/${path.split("/").pop()}`;
        return (
          <div key={index}>
            <img src={imagePath} alt="User Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
            {tags && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>Tags: </div>
                <div>
                  {tags.map((tag, tagIndex) => (
                    <span key={tagIndex}>
                      {tag} {User_ID === userId && <Button size="small" onClick={() => handleDeleteTag(id, tag)}>X</Button>}
                    </span>
                  ))}
                </div>
                {User_ID === userId && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField 
                      label="New Tag"
                      value={tagMap[id] || ''}
                      onChange={(e) => setTagMap({ ...tagMap, [id]: e.target.value })}
                      style={{ marginLeft: "10px" }}
                    />
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleAddTag(id, tagMap[id] || '')}
                      style={{ marginLeft: "10px" }}
                    >
                      Add Tag
                    </Button>
                  </div>
                )}
              </div>
            )}

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
