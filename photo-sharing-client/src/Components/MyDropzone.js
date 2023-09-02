import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import auth from "../Components/Login/Firebase-config";

const MyDropzone = (props) => {
  const [response, setResponse] = useState(null);
  const [preview, setPreview] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [visibility, setVisibility] = useState("Public");
  const [tag, setTag] = useState("");
  const [fetchedTag, setFetchedTag] = useState("");
  const fetchedPresets = props.presets;
  const [isInputActive, setIsInputActive] = useState(false);


  const fetchTagFromAPI = async (file) => {
    // fetch the tag from the API and set it
    const fetchedTagFromAPI = "mock"; // mock API data
    setFetchedTag(fetchedTagFromAPI);
    
    const presetVisibility = getVisibilityForTag(fetchedTagFromAPI);
    if (presetVisibility) {
      setVisibility(presetVisibility);
    }
  };

  const getVisibilityForTag = (tag) => {
    // get the predetermined visibility for the tag if exists
    const preset = fetchedPresets.find(p => p.tagName === tag);
    return preset ? preset.visibility : "Public"; 
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFileToUpload(file);
    setPreview(URL.createObjectURL(file));
    fetchTagFromAPI(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleTagChange = (e) => {
    const newTag = e.target.value;
  
    if (newTag === 'custom') {
      toggleInputActive();
      return;
    }
  
    setTag(newTag);
    const presetVisibility = getVisibilityForTag(newTag);
    if (presetVisibility) {
      setVisibility(presetVisibility);
    }
  };

  const handleTagInputChange = (e) => {
    setTag(e.target.value);
  };
  
  const toggleInputActive = () => {
    setIsInputActive(true);
  };

  const updateUserPresets = (newTag, visibility) => {
    const userId = auth.currentUser?.uid;
    const newPresets = [...fetchedPresets, { tagName: newTag, visibility }];
    
    axios.post('http://127.0.0.1:5001/set-user-tag-presets', {
      tagPresets: newPresets,
      user_id: userId,
    }).then(() => {
      console.log('Tag presets updated successfully!');
      props.updateFetchedPresets(newPresets);
    }).catch((err) => {
      console.error(err);
      console.log('Failed to update tag presets.');
    });
  };
  

  const uploadImage = (event) => {
    event.preventDefault();
    const effectiveTag = tag === "" ? "" : (tag || fetchedTag);
    const formData = new FormData();
    formData.append('img', fileToUpload);
    formData.append('visibility', visibility);
    formData.append('tag', effectiveTag);

    const userId = auth.currentUser?.uid;
    formData.append('user_id', userId);

    axios.post('http://127.0.0.1:5001/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      setResponse(res.data.message);
      props.onPhotoUpload();

      // Check if new or fetched tag is not in user's presets
      if (effectiveTag && !fetchedPresets.some(p => p.tagName === effectiveTag)) {
        updateUserPresets(effectiveTag, visibility);
      }

      // resetting the states to initial values
      setPreview("");
      setFileToUpload(null);
      setVisibility("Public");
      setTag("");
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

            <FormControl style={{ margin: '20px auto', minWidth: '300px', maxWidth: '500px' }}>
              <FormLabel component="legend">Tag</FormLabel>
              {isInputActive ? (
                <input
                  value={tag}
                  onChange={handleTagInputChange}
                  onBlur={() => setIsInputActive(false)}
                  autoFocus
                />
              ) : (
                <select value={tag} onChange={handleTagChange} style={{ width: '100%' }}>
                  <option value="">
                    Choose a tag or input your own
                  </option>
                  {fetchedTag && <option value={fetchedTag}>{fetchedTag} (Fetched)</option>}
                  {fetchedPresets.map((preset, index) => (
                    <option key={index} value={preset.tagName}>
                      {preset.tagName}
                    </option>
                  ))}
                  <option value="custom">
                    Input your own tag
                  </option>
                </select>
              )}
            </FormControl>


            <FormControl component="fieldset" style={{ margin: '20px auto', maxWidth: '300px' }}>
              <FormLabel component="legend">Visibility</FormLabel>
              <RadioGroup
                aria-label="visibility"
                value={visibility}
                onChange={(event) => setVisibility(event.target.value)}
              >
                <FormControlLabel value="Public" control={<Radio />} label="Public" />
                <FormControlLabel value="Private" control={<Radio />} label="Private" />
                <FormControlLabel value="Friends" control={<Radio />} label="Friends" />
              </RadioGroup>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" style={{display: 'block', margin: '20px auto'}}>Confirm</Button>
            <Button onClick={cancelUpload} type="button" variant="contained" color="secondary" style={{display: 'block', margin: 'auto'}}>Cancel</Button>
          </Box>
        )}
        {response && <Box mt={2}><Typography variant="body1">{response}</Typography></Box>}
      </form>
    </Box>
  );
}

export default MyDropzone;
