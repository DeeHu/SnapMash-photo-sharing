import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import auth from "../Components/Login/Firebase-config";

const MyDropzone = (props) => {
  const [response, setResponse] = useState(null);
  const [preview, setPreview] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFileToUpload(acceptedFiles[0]);
    setPreview(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const uploadImage = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('img', fileToUpload);

    const userId = auth.currentUser?.uid;
    formData.append('user_id', userId);

    axios.post('http://127.0.0.1:5001/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      setResponse(res.data.message);
      props.onPhotoUpload();
    }).catch(error => {
      console.error(error);
      setResponse(error.response.data.message);
    });
  }

  const cancelUpload = () => {
    setPreview("");
    setFileToUpload(null);
  }


  return (
    <Box component="section">
      <form onSubmit={uploadImage}>
        <Box {...getRootProps({className: 'dropzone'})} style={{border: '1px dashed #000', padding: '20px', marginTop: '20px', cursor: 'pointer'}}>
          <input {...getInputProps()} />
          <Typography variant="body1">
            {isDragActive ? 'Drop the files here ...' : "Drag 'n' drop some files here, or click to select files"}
          </Typography>
        </Box>
        {preview && (
          <Box mt={2}>
            <img src={preview} alt="Preview" style={{maxWidth: "200px", display: 'block', margin: 'auto'}}/>
            <Button type="submit" variant="contained" color="primary" style={{display: 'block', margin: '20px auto'}}>Confirm</Button>
            <Button onClick={cancelUpload} type="button" variant="contained" color="secondary" style={{display: 'block', margin: 'auto'}}>Choose Another</Button>
          </Box>
        )}
        {response && <Box mt={2}><Typography variant="body1">{response}</Typography></Box>}
      </form>
    </Box>
  );
}

export default MyDropzone;
