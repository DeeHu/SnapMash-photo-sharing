import React, { useState, useEffect } from 'react';
import axios from 'axios';
import auth from "../Components/Login/Firebase-config";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const TagPresetForm = ({ tagPresets, setTagPresets, fetchPresets }) => {
//   const [tagPresets, setTagPresets] = useState([]);

//   const fetchPresets = async () => {
//     const userId = auth.currentUser?.uid;
//     try {
//       const response = await axios.get(`http://127.0.0.1:5001/get-user-tag-presets?user_id=${userId}`);
//       setTagPresets(response.data.tagPresets);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to fetch tag presets.');
//     }
//   };

//   useEffect(() => {
//     fetchPresets();
//   }, []);

  const handleSubmit = async () => {
    const userId = auth.currentUser?.uid;
    try {
      await axios.post('http://127.0.0.1:5001/set-user-tag-presets', {
        tagPresets,
        user_id: userId,
      });
      alert('Tag presets saved successfully!');

      await fetchPresets();
    } catch (err) {
      console.error(err);
      alert('Failed to save tag presets.');
    }
  };

  const handleInputChange = (index, field, value) => {
    const newPresets = [...tagPresets];
    newPresets[index][field] = value;
    setTagPresets(newPresets);
  };

  const addPreset = () => {
    setTagPresets([...tagPresets, { tagName: '', visibility: 'Public' }]);
  };

  const deletePreset = (index) => {
    const newPresets = [...tagPresets];
    newPresets.splice(index, 1);
    setTagPresets(newPresets);
  };

  return (
    <div>
      <h3>Set Your Tag Presets</h3>
      {tagPresets.map((preset, index) => (
        <div key={index}>
          <TextField
            label="Tag Name"
            value={preset.tagName}
            onChange={(e) => handleInputChange(index, 'tagName', e.target.value)}
          />
          <FormControl>
            <InputLabel>Visibility</InputLabel>
            <Select
              value={preset.visibility}
              onChange={(e) => handleInputChange(index, 'visibility', e.target.value)}
            >
              <MenuItem value="Public">Public</MenuItem>
              <MenuItem value="Friends">Friends</MenuItem>
              <MenuItem value="Private">Private</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="secondary" onClick={() => deletePreset(index)}>
            Delete
          </Button>
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={addPreset}>
        Add Another Tag
      </Button>
      <Button variant="contained" color="secondary" onClick={handleSubmit}>
        Save Presets
      </Button>
    </div>
  );
};

export default TagPresetForm;
