import React from 'react';
import MyDropzone from './MyDropzone'; // Assuming you've defined this component

const UploadForm = (props) => {
  return (
    <div>
      <h2>Upload Image</h2>
      <MyDropzone onPhotoUpload={props.onPhotoUpload} presets={props.presets} updateFetchedPresets={props.updateFetchedPresets} />
      {/* Other form fields go here */}
    </div>
  );
}

export default UploadForm;
