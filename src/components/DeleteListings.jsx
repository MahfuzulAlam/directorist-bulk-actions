import React, { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import DeleteTypeSelector from './fields/DeleteTypeSelector';
import DeleteMediaOptions from './fields/DeleteMediaOptions';
import DeleteMetasField from './fields/DeleteMetasField';
import CategorySelect from './fields/CategorySelect';
import DirectoryTypes from './fields/DirectoryTypes';
import Swal from "sweetalert2";

const DeleteListings = () => {

  const [offset, setOffset] = useState(0);
  const [totalUpdated, setTotalUpdated] = useState(0);
  const [missingAddress, setMissingAddress] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showError, setShowError] = useState('');
  const [log, setLog] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [directoryOptions, setDirectoryOptions] = useState([]);

  const [deleteType, setDeleteType] = useState('trash');
  const [deleteMedia, setDeleteMedia] = useState([]);
  const [deleteMetas, setDeleteMetas] = useState([]);
  const [category, setCategory] = useState([]);
  const [directory, setDirectory] = useState([]);

  const limit = 5;
  const progressNumber = (5 / dba_data.totalListings) * 100;

  // const categoryOptions = [
  //   { label: 'Real Estate', value: 'real-estate' },
  //   { label: 'Automotive', value: 'automotive' },
  //   { label: 'Jobs', value: 'jobs' },
  //   { label: 'Services', value: 'services' },
  // ];

  useEffect(() => {
    apiFetch({ path: '/directorist/v1/listings/categories?hide_empty=true' })
      .then((data) => setCategoryOptions( transformOptions(data)))
      .catch((error) => console.error('Error fetching categories:', error));
    setDirectoryOptions( transformOptions( window.dba_data.allDirectoryTypes ) );
  }, []);

  function transformOptions(data) {
    return data.map(item => ({
      label: decodeHtmlEntities( item.name + " - " + item.count ),
      value: item.slug,
    }));
  }

  function decodeHtmlEntities(text) {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
  }

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        // Execute your action here
        startDelete();
        //Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };


  const startDelete = () => {

    console.log(deleteType);
    console.log(deleteMedia);
    console.log(deleteMetas);
    console.log(category);
    console.log(directory);

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
          path: `${window.dba_data.restUrl}/delete/listings`,
          method: 'POST',
          data: {
            offset: currentOffset,
            limit: limit,
            category: category,
            directory_types: directory,
            metas: deleteMetas,
            media: deleteMedia,
          }
        });

        if (response.status == 'error') {
          setShowError(response.message);
          setUpdating(false);
          return;
        }

        if( response.status == 'completed'){
          setCompleted(true);
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
      <h2>Delete Listings</h2>
      <p className="note">Please select the options to delete the listings in your website.</p>
      {showError && (
        <p className="error">{showError}</p>
      )}

      <div className="delete-fields">
        <DeleteTypeSelector onChange={(value) => setDeleteType(value)} />
        <DeleteMediaOptions onChange={(selected) => setDeleteMedia(selected)} />
        <DeleteMetasField onChange={(data) => setDeleteMetas(data)} />
        <CategorySelect
          options={categoryOptions}
          onChange={(selected) => setCategory(selected)}
        />
        <DirectoryTypes
          options={directoryOptions}
          onChange={(selected) => setDirectory(selected)}
        />
      </div>

      <button
        className="update-coordinates"
        onClick={handleDelete}
        disabled={updating}
      >
        {updating ? 'Deleting ..' : 'Start Delete'}
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

export default DeleteListings;