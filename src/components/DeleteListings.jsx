import React, { useEffect, useState } from 'react';

const DeleteListings = ({ isActive }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (isActive) {
      // generate or fetch data again
      setData('This is newly generated data ' + new Date().toISOString());
    }
  }, [isActive]);

  return <div>{data}</div>;
}

export default DeleteListings;