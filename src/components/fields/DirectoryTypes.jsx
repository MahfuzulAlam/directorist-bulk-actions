import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const DirectoryTypes = ({ options = [], onChange }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleChange = (selected) => {
    setSelectedTypes(selected);
    if (onChange) {
      onChange(selected);
    }
  };

  return (
    <div className="category-select-field">
      <label className="label">Directory Types</label>
      <p className="help-text">Select directory to delete listings from:</p>
      <Select
        isMulti
        isSearchable
        options={options}
        value={selectedTypes}
        onChange={handleChange}
        placeholder="Select directory types..."
      />
    </div>
  );
};

export default DirectoryTypes;
