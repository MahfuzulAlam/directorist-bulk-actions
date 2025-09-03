import React, { useState } from 'react';
import Papa from 'papaparse';
import apiFetch from '@wordpress/api-fetch';

const UpdateListings = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [directory, setDirectory] = useState(0);
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
        if (!directory) return;

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
                const response = await apiFetch({
                    path: `${window.dba_data.restUrl}/update/listings`,
                    method: 'POST',
                    data: {
                        directory,
                        items: batch
                    }
                });

                response.results?.forEach((result, index) => {
                    const row = batch[index];
                    if (result.status === 'success') {
                        updated++;
                        setTotalUpdated(updated);
                        setLog(prev => [...prev, `✅ Updated: ${row.listing_title} - ${result.message}`]);
                    } else {
                        failed++;
                        setTotalFailed(failed);
                        setLog(prev => [...prev, `❌ Failed: ${row.listing_title} - ${result.message}`]);
                    }
                });

            } catch (err) {
                console.log(err);
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
            <div className="all-import-wrapper import-card">

                <h3>Update Listings</h3>
                <p>Select the directory type you want to upload the listings with CSV file</p>
                <p className="note">Listings will be updated if they match either the listings ID only.</p>

                <select
                    value={directory}
                    onChange={(e) => setDirectory(e.target.value)}
                    className="directory-select"
                >
                    <option value="">Directory type</option>
                    {window.dba_data.directoryTypes &&
                        Object.entries(window.dba_data.directoryTypes).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                </select>

                <input type="file" accept=".csv" onChange={handleCSVChange} />

                <button
                    className="import-taxonomies"
                    onClick={handleCSVUpload}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Start Update'}
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

export default UpdateListings;