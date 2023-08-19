import React, { useEffect, useState } from 'react';
import axios from 'axios';
import auth from './Login/Firebase-config';

const UserPhotos = () => {
  const [photoPaths, setPhotoPaths] = useState([]);
  
  useEffect(() => {
    const fetchPhotos = async () => {
      const userId = auth.currentUser?.uid;
      try {
        const response = await axios.get('http://127.0.0.1:5001/get-user-photos', {
          params: {
            user_id: userId
          }
        });
        setPhotoPaths(response.data.photos);
      } catch (error) {
        console.error("Error fetching user photos:", error);
      }
    };

    fetchPhotos();
  }, []);
  
  return (
    <div>
    {photoPaths.map((path, index) => {
      // convert the server-side file path to an HTTP route
      const imagePath = `http://127.0.0.1:5001/images/${path.split("/").pop()}`;
      return <img key={index} src={imagePath} alt="User Uploaded" style={{maxWidth: '100%', height: 'auto'}} />;
    })}
  </div>
  );
}

export default UserPhotos;
