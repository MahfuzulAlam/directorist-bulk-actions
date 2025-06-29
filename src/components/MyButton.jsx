import React from 'react';

const MyButton = ({ label, onClick }) => {
  return (
    <button onClick={onClick} className="my-button">
      {label}
    </button>
  );
};

export default MyButton;