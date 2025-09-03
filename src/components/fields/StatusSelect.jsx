import React, { useState } from 'react';
import Select from 'react-select';

const StatusSelect = ({ options = [], onChange }) => {
  const [selectedStatus, setSelectedStatus] = useState([]);

  const handleChange = (selected) => {
    setSelectedStatus(selected);
    if (onChange) {
      onChange(selected);
    }
  };

  return (
    <div className="status-select-field">
      <label className="label">Status</label>
      <p className="help-text">Select status to delete listings</p>
      <Select
        isMulti
        isSearchable
        options={options}
        value={selectedStatus}
        onChange={handleChange}
        placeholder="Select status..."
      />
    </div>
  );
};

export default StatusSelect;
