import React from 'react';
import Select from 'react-select';

/**
 * Reusable single-value react-select field with the plugin's
 * label + help-text markup. Pass options as { value, label } pairs.
 */
const SingleSelect = ({ label, helpText, options = [], value = null, onChange, placeholder = 'Select...' }) => (
  <div className="dba-select-field">
    {label && <label className="label">{label}</label>}
    {helpText && <p className="help-text">{helpText}</p>}
    <Select
      isSearchable
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      classNamePrefix="dba-select"
    />
  </div>
);

export default SingleSelect;
