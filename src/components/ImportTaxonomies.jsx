import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const ImportTaxonomies = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [taxonomy, setTaxonomy] = useState('category');
  const [totalUpdated, setTotalUpdated] = useState(0);
  const [totalAdded, setTotalAdded] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState([]);

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

    setLoading(true);
    setTotalUpdated(0);
    setTotalAdded(0);
    setTotalFailed(0);
    setLog([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        processBatches(rows);
      },
    });
  };

  const processBatches = async (rows) => {
    let updated = 0, added = 0, failed = 0;
    const batchSize = 10;
    const total = rows.length;

    for (let i = 0; i < total; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);

      try {
        const response = await axios.post(`${window.dba_data.restUrl}/import/taxonomies`, {
          taxonomy,
          items: batch,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.dba_data?.nonce || '',
          },
        });

        response.data?.forEach((result, index) => {
          const row = batch[index];
          if (result.status === 'updated') {
            updated++;
            setTotalUpdated(updated);
            setLog(prev => [...prev, `✅ Updated: ${row.name}`]);
          } else if (result.status === 'added') {
            added++;
            setTotalAdded(added);
            setLog(prev => [...prev, `🆕 Added: ${row.name}`]);
          } else {
            failed++;
            setTotalFailed(failed);
            setLog(prev => [...prev, `❌ Failed: ${row.name}`]);
          }
        });

      } catch (err) {
        batch.forEach(row => {
          failed++;
          setLog(prev => [...prev, `❌ Failed: ${row.name}`]);
        });
      }

      setProgress(Math.round(((i + batchSize) / total) * 100));
    }

    setTotalUpdated(updated);
    setTotalAdded(added);
    setTotalFailed(failed);
    setLoading(false);
  };

  return (
    <div className="csv-import-container">
      <div className="import-card">
        <h3>Import Taxonomy</h3>
        <p>Select the taxonomy you want to import and upload the CSV file</p>
        <p className="note">Terms will be updated if they match either the term ID or the term slug.</p>

        <select
          value={taxonomy}
          onChange={(e) => setTaxonomy(e.target.value)}
          className="taxonomy-select"
        >
          <option value="category">Categories</option>
          <option value="location">Locations</option>
        </select>

        <input type="file" accept=".csv" onChange={handleCSVChange} />

        <button
          className="import-taxonomies"
          onClick={handleCSVUpload}
          disabled={loading}
        >
          {loading ? 'Importing...' : 'Start Import'}
        </button>

        {progress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div className="coordinator-status">
          {totalUpdated > 0 && (
            <p>Total Updated: <strong>{totalUpdated}</strong></p>
          )}
          {totalAdded > 0 && (
            <p>Total Added: <strong>{totalAdded}</strong></p>
          )}
          {totalFailed > 0 && (
            <p>Total Failed: <strong>{totalFailed}</strong></p>
          )}
        </div>

        {log.length > 0 && (
          <div className="coordinator-log">
            {[...log].reverse().map((entry, index) => (
              <div key={index}>- {entry}</div>
            ))}
          </div>
        )}

        {loading && <div className="spinner"></div>}
      </div>
    </div>
  );
};

export default ImportTaxonomies;