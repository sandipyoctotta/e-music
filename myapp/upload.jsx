import React from 'react';

function FileUpload() {
  return (
    <div>
      <label htmlFor="fileInput" id="button1">Upload</label>
      <input type="file" id="fileInput" name="file" />
    </div>
  );
}

export default FileUpload;
