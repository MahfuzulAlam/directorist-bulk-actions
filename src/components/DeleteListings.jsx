import React, { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import DeleteTypeSelector from './fields/DeleteTypeSelector';
import DeleteMediaOptions from './fields/DeleteMediaOptions';
import DeleteMetasField from './fields/DeleteMetasField';
import CategorySelect from './fields/CategorySelect';
import DirectoryTypes from './fields/DirectoryTypes';
import StatusSelect from './fields/StatusSelect';
import UserSelect from './fields/UserSelect';
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
  const [statusOptions, setStatusOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [totalListings, setTotalListings] = useState(0);

  const [deleteType, setDeleteType] = useState('trash');
  const [deleteMedia, setDeleteMedia] = useState([]);
  const [deleteMetas, setDeleteMetas] = useState([]);
  const [category, setCategory] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);

  const limit = 5;
  const progressNumber = (5 / dba_data.totalListings) * 100;

  useEffect(()=>{
    setTotalListings(window.dba_data.totalListings);
  }, []);

  useEffect(() => {
    apiFetch({ path: '/directorist/v1/listings/categories?hide_empty=true' })
      .then((data) => setCategoryOptions(transformOptions(data)))
      .catch((error) => console.error('Error fetching categories:', error));

    apiFetch( { path: addQueryArgs( '/directorist/v1/users', {custom: 'bulk_action'} ) } )
    .then( ( data ) =>  setUserOptions(transformUserOptions(data)))
    .catch((error) => console.error('Error fetching categories:', error));

    setDirectoryOptions(transformOptions(window.dba_data.allDirectoryTypes));
    setStatusOptions(transformStatusOptions(window.dba_data.statuses));
  }, []);

  const getListingCount = async (updatedCategory = category, updatedDirectory = directory, updatedStatus = status, updatedUsers = users) => {
    try {
      const response = await apiFetch({
        path: `${window.dba_data.restUrl}/listing/count`,
        method: 'POST',
        data: {
          category: updatedCategory,
          directory_types: updatedDirectory,
          status: updatedStatus,
          users: updatedUsers,
        }
      });
      if (response && response.count !== undefined) {
        setTotalListings(response.count);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  function transformOptions(data) {
    return data.map(item => ({
      label: decodeHtmlEntities(item.name + " - " + item.count),
      value: item.slug,
    }));
  }

  function transformUserOptions(data) {
    return data.map(user => ({
      label: decodeHtmlEntities(user.name),
      value: user.id,
    }));
  }

  function transformStatusOptions(data) {
    return Object.entries(data).map(([key, label]) => ({
      label: label,
      value: key,
    }));
  }

  function decodeHtmlEntities(text) {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
  }

const handleDelete = () => {
  Swal.fire({
    title: "Confirm deletion",
    html: 'To proceed, please type <b>Delete</b>.',
    input: "text",
    inputPlaceholder: "Delete",
    inputAttributes: { autocapitalize: "off", autocorrect: "off" },
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    focusConfirm: false,
    inputValidator: (value) => {
      if ((value || "").trim() !== "Delete") {
        return 'Please type "Delete" exactly to confirm.';
      }
      return undefined; // valid
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Only reaches here if the input matched "Delete"
      startDelete();
    }
  });
};


  const startDelete = () => {

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
            status: status,
            users: users,
            type: deleteType,
            metas: deleteMetas,
            media: deleteMedia,
          }
        });

        if (response.status == 'error') {
          setShowError(response.message);
          setUpdating(false);
          return;
        }

        if (response.status == 'completed') {
          setCompleted(true);
          setUpdating(false);
          return;
        }

        const postsCount = response.posts?.length || 0;
        const deletedCount = response.deleted?.length || 0;
        const curMissAdrs = postsCount - deletedCount;

        setLog(prev => [...prev, `Batch ${currentOffset / limit}: ${deletedCount}/${postsCount} deleted.`]);

        if (postsCount === 0) {
          setCompleted(true);
          setUpdating(false);
          return;
        }

        allUpdated += deletedCount;
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
    <div className="coordinators-wrapper all-import-wrapper">
      <h3>Delete Listings</h3>
      <p className="note">Please select the options to delete the listings in your website.</p>
      {showError && (
        <p className="error">{showError}</p>
      )}

      <div className="delete-fields">
        <DirectoryTypes
          options={directoryOptions}
          onChange={(selected) => {setDirectory(selected); getListingCount(category, selected, status, users)}}
        />
        <CategorySelect
          options={categoryOptions}
          onChange={(selected) => {setCategory(selected); getListingCount(selected, directory, status, users)}}
        />
        <StatusSelect
          options={statusOptions}
          onChange={(selected) => {setStatus(selected); getListingCount(category, directory, selected, users)}}
        />
        <UserSelect
          options={userOptions}
          onChange={(selected) => {setUsers(selected); getListingCount(category, directory, status, selected)}}
        />
        <DeleteTypeSelector onChange={(value) => setDeleteType(value)} />
        <DeleteMediaOptions onChange={(selected) => setDeleteMedia(selected)} />
        <DeleteMetasField onChange={(data) => setDeleteMetas(data)} />
        { totalListings && totalListings > 0 && <p className="error">Total Listings to be Deleted: {totalListings}</p> }
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
          Total Deleted: <strong>{totalUpdated}</strong>
        </p>
      )}
      {missingAddress > 0 && (
        <p className="coordinator-status">
          Total Failed: <strong>{missingAddress}</strong>
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