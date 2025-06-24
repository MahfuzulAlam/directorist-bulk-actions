import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    const [offset, setOffset] = useState(0);
    const [totalUpdated, setTotalUpdated] = useState(0);
    const [missingAddress, setMissingAddress] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [log, setLog] = useState([]);

    const limit = 5;
    const progressNumber = ( 5 / dba_data.totalListings ) * 100;
    
    const updateCoordinates = () => {
        setUpdating(true);
        setCompleted(false);
        setTotalUpdated(0);
        setMissingAddress(0);
        setOffset(0);
        setProgress(0);
        setLog([]);

        let currentOffset = 0;
        let allUpdated = 0;

        const runBatch = async () => {
            try {
                console.log( offset );
                console.log( progress );
                const response = await fetch(`${window.dba_data.restUrl}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': window.dba_data.nonce
                    },
                    body: JSON.stringify({ offset: currentOffset, limit: limit })
                });
                const data = await response.json();

                console.log( data );

                const postsCount = data.posts?.length || 0;
                const updatedCount = data.updated?.length || 0;
                const curMissAdrs = postsCount - updatedCount;

                setLog(prev => [...prev, `Batch ${currentOffset / limit}: ${updatedCount}/${postsCount} updated.`]);

                if (postsCount === 0) {
                    setCompleted(true);
                    setUpdating(false);
                    return;
                }

                allUpdated += updatedCount;
                setTotalUpdated(allUpdated);
                currentOffset += limit;
                setOffset((prev) => prev + limit);
                setProgress((prev) => prev + progressNumber);
                setMissingAddress((prev) => prev + curMissAdrs);

                // Continue to next batch
                runBatch();

            } catch (error) {
                console.error('API Error:', error);
                setLog(prev => [...prev, `Error at offset ${currentOffset}`]);
                setUpdating(false);
            }
        };

        runBatch();
    }

    return (
        <div className="wrap">
            <h1 className="wp-heading-inline">Directorist - Bulk Actions</h1>
            <p>Welcome to the Directorist Bulk Actions plugin page!</p>
            <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'Arial' }}>
                <h2>Update Listing Coordinates</h2>
                <button
                    className="update-coordinates"
                    onClick={updateCoordinates}
                    disabled={updating}
                    style={{
                    padding: '10px 20px',
                    backgroundColor: updating ? '#999' : '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: updating ? 'not-allowed' : 'pointer'
                    }}
                >
                    {updating ? 'Updating...' : 'Start Update'}
                </button>

                <div style={{ marginTop: '20px' }}>
                    <div style={{
                    height: '20px',
                    width: '100%',
                    backgroundColor: '#eee',
                    borderRadius: '10px',
                    overflow: 'hidden'
                    }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: '#28a745',
                        transition: 'width 0.3s'
                    }}></div>
                    </div>
                    <p style={{ marginTop: '10px' }}>
                        Total Updated: <strong>{totalUpdated}</strong>
                    </p>
                    <p style={{ marginTop: '10px' }}>
                        Total Missing Address: <strong>{missingAddress}</strong>
                    </p>
                    {completed && <p style={{ color: 'green' }}>✅ All listings processed!</p>}
                </div>

                <div style={{ marginTop: '20px', fontSize: '14px', color: '#555', overflow: 'scroll', maxHeight: '300px' }}>
                    {[...log].reverse().map((entry, i) => (
                        <div key={i}>- {entry}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('my-react-app'));
root.render(<App />);
