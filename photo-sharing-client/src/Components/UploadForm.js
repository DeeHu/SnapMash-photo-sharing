import React from 'react';
import MyDropzone from './MyDropzone'; // Assuming you've defined this component

const UploadForm = () => {
  return (
    <div>
      <h2>Upload Image</h2>
      <MyDropzone />
      {/* Other form fields go here */}
    </div>
  );
}

export default UploadForm;
