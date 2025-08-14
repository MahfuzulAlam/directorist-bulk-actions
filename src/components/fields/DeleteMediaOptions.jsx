import React, { useState } from 'react';

export default function DeleteMediaOptions({ onChange }) {
  const [mediaOptions, setMediaOptions] = useState({
    featured: false,
    gallery: false,
    files: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const updated = { ...mediaOptions, [name]: checked };
    setMediaOptions(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  return (
    <div className="delete-media-options">
      <label className="label">Delete Media</label>
      <div className="options">
        <label className="checkbox-option">
          <input
            type="checkbox"
            name="featured"
            checked={mediaOptions.featured}
            onChange={handleCheckboxChange}
          />
          Featured Image
        </label>
        <label className="checkbox-option">
          <input
            type="checkbox"
            name="gallery"
            checked={mediaOptions.gallery}
            onChange={handleCheckboxChange}
          />
          Gallery Images
        </label>
        {/* <label className="checkbox-option">
          <input
            type="checkbox"
            name="files"
            checked={mediaOptions.files}
            onChange={handleCheckboxChange}
          />
          Files Uploaded
        </label> */}
      </div>
    </div>
  );
}
