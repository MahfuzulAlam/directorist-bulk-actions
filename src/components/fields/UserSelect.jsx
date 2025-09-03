import React, { useState } from 'react';
import Select from 'react-select';

const UserSelect = ({ options = [], onChange }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleChange = (selected) => {
    setSelectedUsers(selected);
    if (onChange) {
      onChange(selected);
    }
  };

  return (
    <div className="status-select-field">
      <label className="label">Users</label>
      <p className="help-text">Select users to delete their listings</p>
      <Select
        isMulti
        isSearchable
        options={options}
        value={selectedUsers}
        onChange={handleChange}
        placeholder="Select users..."
      />
    </div>
  );
};

export default UserSelect;
