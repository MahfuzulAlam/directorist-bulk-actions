import React, { useState } from 'react';
import Select from 'react-select';

const DeleteMetasField = ({ onChange }) => {
  const [deleteType, setDeleteType] = useState('none');
  const [selectedMetas, setSelectedMetas] = useState([]);

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setDeleteType(value);
    if (onChange) {
      onChange({
        deleteType: value,
        selected: value === 'selected' ? selectedMetas : [],
      });
    }
  };

  const handleMetaSelect = (selected) => {
    setSelectedMetas(selected);
    if (onChange) {
      onChange({
        deleteType,
        selected,
      });
    }
  };

  // You can later replace this with data from PHP or REST API
  const metaOptions = [
    { label: 'price', value: 'price' },
    { label: 'location', value: 'location' },
    { label: 'phone_number', value: 'phone_number' },
    { label: 'website', value: 'website' },
    { label: 'custom_field', value: 'custom_field' },
  ];

  return (
    <div className="bulk-delete-metas">
      <label className="label">Delete Metas</label>
      <div className="options">
        <label className="radio-option">
          <input
            type="radio"
            name="meta_delete_type"
            value="none"
            checked={deleteType === 'none'}
            onChange={handleTypeChange}
          />
          None
        </label>
        <label className="radio-option">
          <input
            type="radio"
            name="meta_delete_type"
            value="all"
            checked={deleteType === 'all'}
            onChange={handleTypeChange}
          />
          All Meta Values
        </label>
        {/* <label className="radio-option">
          <input
            type="radio"
            name="meta_delete_type"
            value="selected"
            checked={deleteType === 'selected'}
            onChange={handleTypeChange}
          />
          Selected Meta Values
        </label> */}
      </div>

      {/* {deleteType === 'selected' && (
        <div className="meta-select">
          <label className="label">Select Meta Keys to Delete:</label>
          <Select
            isMulti
            isSearchable
            options={metaOptions}
            value={selectedMetas}
            onChange={handleMetaSelect}
            placeholder="Search and select meta keys..."
          />
        </div>
      )} */}
    </div>
  );
};

export default DeleteMetasField;
