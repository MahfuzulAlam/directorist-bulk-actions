import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const ImportCategories = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleCSVChange = (e) => {
    try {
      const csvfile = e.target.files[0];
      if (csvfile) setFile(csvfile);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCSVUpload = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        processImport(rows);
      },
    });
  };

  const processImport = async (rows) => {
    setLoading(true);

    for (const row of rows) {
      try {
        await axios.post('/wp-json/your-namespace/v1/import', row, {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.dba_data?.nonce || '', // optional chaining
          },
        });
        console.log('Imported:', row);
      } catch (err) {
        console.error('Failed to import:', row, err);
      }
    }

    setLoading(false);
    alert('Import complete!');
  };

  return (
    <div className="csv-import-container">
      <div className="import-card">
        <h3>Import Taxonomy</h3>
        <p>Select the taxonomy you want to import and upload the CSV file</p>
        <input type="file" accept=".csv" onChange={handleCSVChange} />
        {loading && <p>Importing data, please wait...</p>}
        <button
          className="import-taxonomies"
          onClick={handleCSVUpload}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Start Update'}
        </button>
        {loading && (
          <>
            <div className="spinner"></div>
            <p>Importing data, please wait...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImportCategories;
