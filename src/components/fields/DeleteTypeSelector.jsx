import React, { useState } from 'react';

export default function DeleteTypeSelector({ onChange }) {
  const [deleteType, setDeleteType] = useState('trash');

  const handleChange = (e) => {
    const value = e.target.value;
    setDeleteType(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="bulk-delete-type">
      <label className="label">Delete Type</label>
      <div className="options">
        <label className="checkbox-option">
          <input
            type="radio"
            name="delete_type"
            value="trash"
            checked={deleteType === 'trash'}
            onChange={handleChange}
          />
          Move to Trash
        </label>
        <label className="checkbox-option">
          <input
            type="radio"
            name="delete_type"
            value="permanent"
            checked={deleteType === 'permanent'}
            onChange={handleChange}
          />
          Delete Permanently
        </label>
      </div>
    </div>
  );
}
