import React, { useState } from 'react';

const SetCoordinates = () => {

  const [offset, setOffset] = useState(0);
  const [totalUpdated, setTotalUpdated] = useState(0);
  const [missingAddress, setMissingAddress] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showError, setShowError] = useState('');
  const [log, setLog] = useState([]);

  const limit = 5;
  const progressNumber = (5 / dba_data.totalListings) * 100;

  const updateCoordinates = () => {

    setUpdating(true);
    setCompleted(false);
    setTotalUpdated(0);
    setMissingAddress(0);
    setOffset(0);
    setProgress(0);
    setLog([]);
    setShowError('');

    let currentOffset = 0;
    let allUpdated = 0;

    const runBatch = async () => {
      try {
        const response = await fetch(`${window.dba_data.restUrl}` + `/update/coordinates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.dba_data.nonce
          },
          body: JSON.stringify({ offset: currentOffset, limit: limit })
        });
        const data = await response.json();

        if (data.status == 'error') {
          setShowError(data.message);
          setUpdating(false);
          return;
        }

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
    <div className="coordinators-wrapper">
      <h2>Update Listing Coordinates</h2>
      <p className="note">Coordinates will not be updated if the address field is empty or the Google Maps API is not configured correctly in the Directorist Settings.</p>
      {showError && (
        <p className="error">{showError}</p>
      )}
      <button
        className="update-coordinates"
        onClick={updateCoordinates}
        disabled={updating}
      >
        {updating ? 'Updating...' : 'Start Update'}
      </button>

      {progress > 0 && (
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {totalUpdated > 0 && (
        <p className="coordinator-status">
          Total Updated: <strong>{totalUpdated}</strong>
        </p>
      )}
      {missingAddress > 0 && (
        <p className="coordinator-status">
          Total Missing Address: <strong>{missingAddress}</strong>
        </p>
      )}
      {completed && <p className="coordinator-status" style={{ color: 'green' }}>✅ All listings processed!</p>}

      {log.length > 0 && (
        <div className="coordinator-log">
          {[...log].reverse().map((entry, i) => (
            <div key={i}>- {entry}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SetCoordinates;