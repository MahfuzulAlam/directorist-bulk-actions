import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';

const RunListingUpdate = () => {

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
        const response = await apiFetch({
          path: `${window.dba_data.restUrl}/run/update`,
          method: 'POST',
          data: {
            offset: currentOffset,
            limit: limit
          }
        });

        console.log(response);

        if (response.status == 'error') {
          setShowError(response.message);
          setUpdating(false);
          return;
        }

        const postsCount = response.posts?.length || 0;
        const updatedCount = response.updated?.length || 0;
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
      <h2>Update Listings Infomation</h2>
      <p className="note">
        You can update listing information by using this method. Please use the following action hook to update the listings.<br/>
        "directorist_bulk_actions_run_update_loop"<br/>
        only parameter is $listing_id
      </p>
      {showError && (
        <p className="error">{showError}</p>
      )}
      <button
        className="update-coordinates"
        onClick={updateCoordinates}
        disabled={updating}
      >
        {updating ? 'Updating...' : 'Run Update'}
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
          Total Missing: <strong>{missingAddress}</strong>
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

export default RunListingUpdate;