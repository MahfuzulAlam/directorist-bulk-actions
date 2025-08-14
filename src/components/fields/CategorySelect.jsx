import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const CategorySelect = ({ options = [], onChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleChange = (selected) => {
    setSelectedCategories(selected);
    if (onChange) {
      onChange(selected);
    }
  };

  return (
    <div className="category-select-field">
      <label className="label">Category</label>
      <p className="help-text">Select categories to delete listings from</p>
      <Select
        isMulti
        isSearchable
        options={options}
        value={selectedCategories}
        onChange={handleChange}
        placeholder="Select categories..."
      />
    </div>
  );
};

export default CategorySelect;
