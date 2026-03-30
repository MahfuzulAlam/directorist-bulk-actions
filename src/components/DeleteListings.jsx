import React, { useState, useEffect, useCallback } from 'react';
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

/**
 * DeleteListings Component
 * 
 * A React component for bulk deletion of listings with filtering options.
 * Provides real-time count updates and progress tracking during deletion process.
 * 
 * @returns {JSX.Element} The DeleteListings component
 */
const DeleteListings = () => {
  // Constants
  const BATCH_LIMIT = 5;
  const CONFIRMATION_TEXT = 'Delete';
  
  // State for deletion process tracking
  const [deletionState, setDeletionState] = useState({
    offset: 0,
    totalDeleted: 0,
    totalFailed: 0,
    isDeleting: false,
    progress: 0,
    isCompleted: false,
    error: '',
    log: []
  });

  // State for filter options
  const [filterOptions, setFilterOptions] = useState({
    category: [],
    directory: [],
    status: [],
    users: []
  });

  // State for deletion configuration
  const [deletionConfig, setDeletionConfig] = useState({
    type: 'trash',
    media: [],
    metas: []
  });

  // State for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    categories: [],
    directories: [],
    statuses: [],
    users: []
  });

  // State for listing count
  const [totalListings, setTotalListings] = useState(0);

  /**
   * Initialize component with default total listings count
   */
  useEffect(() => {
    if (window.dba_data?.totalListings) {
      setTotalListings(window.dba_data.totalListings);
    }
  }, []);

  /**
   * Load initial dropdown options on component mount
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load categories
        const categoriesResponse = await apiFetch({ 
          path: '/directorist/v1/listings/categories?hide_empty=true' 
        });
        setDropdownOptions(prev => ({
          ...prev,
          categories: transformOptions(categoriesResponse)
        }));

        // Load users
        const usersResponse = await apiFetch({ 
          path: addQueryArgs('/directorist/v1/users', { custom: 'bulk_action' }) 
        });
        setDropdownOptions(prev => ({
          ...prev,
          users: transformUserOptions(usersResponse)
        }));

        // Load directories and statuses from global data
        if (window.dba_data?.allDirectoryTypes) {
          setDropdownOptions(prev => ({
            ...prev,
            directories: transformOptions(window.dba_data.allDirectoryTypes)
          }));
        }

        if (window.dba_data?.statuses) {
          setDropdownOptions(prev => ({
            ...prev,
            statuses: transformStatusOptions(window.dba_data.statuses)
          }));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setDeletionState(prev => ({
          ...prev,
          error: 'Failed to load filter options. Please refresh the page.'
        }));
      }
    };

    loadInitialData();
  }, []);

  /**
   * Transform API data to dropdown options format
   * @param {Array} data - Raw API data
   * @returns {Array} Transformed options array
   */
  const transformOptions = useCallback((data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => ({
      label: sanitizeText(`${item.name} - ${item.count}`),
      value: sanitizeText(item.slug)
    }));
  }, []);

  /**
   * Transform user data to dropdown options format
   * @param {Array} data - Raw user data
   * @returns {Array} Transformed user options array
   */
  const transformUserOptions = useCallback((data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(user => ({
      label: sanitizeText(user.name),
      value: parseInt(user.id, 10) || 0
    }));
  }, []);

  /**
   * Transform status data to dropdown options format
   * @param {Object} data - Raw status data
   * @returns {Array} Transformed status options array
   */
  const transformStatusOptions = useCallback((data) => {
    if (!data || typeof data !== 'object') return [];
    
    return Object.entries(data).map(([key, label]) => ({
      label: sanitizeText(label),
      value: sanitizeText(key)
    }));
  }, []);

  /**
   * Sanitize text input to prevent XSS attacks
   * @param {string} text - Text to sanitize
   * @returns {string} Sanitized text
   */
  const sanitizeText = useCallback((text) => {
    if (typeof text !== 'string') return '';
    
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    return textarea.value;
  }, []);

  /**
   * Get listing count based on current filters
   * @param {Array} updatedCategory - Updated category filter
   * @param {Array} updatedDirectory - Updated directory filter
   * @param {Array} updatedStatus - Updated status filter
   * @param {Array} updatedUsers - Updated users filter
   */
  const getListingCount = useCallback(async (
    updatedCategory = filterOptions.category,
    updatedDirectory = filterOptions.directory,
    updatedStatus = filterOptions.status,
    updatedUsers = filterOptions.users
  ) => {
    try {
      // Validate API endpoint
      if (!window.dba_data?.restUrl) {
        throw new Error('API endpoint not configured');
      }

      const response = await apiFetch({
        path: `${window.dba_data.restUrl}/listing/count`,
        method: 'POST',
        data: {
          category: Array.isArray(updatedCategory) ? updatedCategory : [],
          directory_types: Array.isArray(updatedDirectory) ? updatedDirectory : [],
          status: Array.isArray(updatedStatus) ? updatedStatus : [],
          users: Array.isArray(updatedUsers) ? updatedUsers : []
        }
      });

      if (response?.count !== undefined && typeof response.count === 'number') {
        setTotalListings(Math.max(0, response.count));
      }
    } catch (error) {
      console.error('Error fetching listing count:', error);
      setDeletionState(prev => ({
        ...prev,
        error: 'Failed to fetch listing count. Please try again.'
      }));
    }
  }, [filterOptions]);

  /**
   * Handle filter option changes
   * @param {string} filterType - Type of filter being changed
   * @param {Array} selectedValues - New selected values
   */
  const handleFilterChange = useCallback((filterType, selectedValues) => {
    const newFilterOptions = {
      ...filterOptions,
      [filterType]: Array.isArray(selectedValues) ? selectedValues : []
    };
    
    setFilterOptions(newFilterOptions);
    
    // Update count with new filter values
    getListingCount(
      newFilterOptions.category,
      newFilterOptions.directory,
      newFilterOptions.status,
      newFilterOptions.users
    );
  }, [filterOptions, getListingCount]);

  /**
   * Show confirmation dialog before starting deletion
   */
  const handleDelete = useCallback(() => {
    // Validate that at least one filter is selected
    const hasFilters = Object.values(filterOptions).some(filter => 
      Array.isArray(filter) && filter.length > 0
    );

    // if (!hasFilters) {
    //   Swal.fire({
    //     title: 'No Filters Selected',
    //     text: 'Please select at least one filter option before proceeding.',
    //     icon: 'warning',
    //     confirmButtonText: 'OK'
    //   });
    //   return;
    // }

    Swal.fire({
      title: "Confirm Deletion",
      html: `To proceed, please type <b>${CONFIRMATION_TEXT}</b>.`,
      input: "text",
      inputPlaceholder: CONFIRMATION_TEXT,
      inputAttributes: { 
        autocapitalize: "off", 
        autocorrect: "off",
        maxlength: CONFIRMATION_TEXT.length
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: '#d33',
      focusConfirm: false,
      inputValidator: (value) => {
        const trimmedValue = (value || "").trim();
        if (trimmedValue !== CONFIRMATION_TEXT) {
          return `Please type "${CONFIRMATION_TEXT}" exactly to confirm.`;
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        startDeletion();
      }
    });
  }, [filterOptions]);

  /**
   * Start the bulk deletion process
   */
  const startDeletion = useCallback(() => {
    // Capture the current filtered count for accurate progress tracking.
    // totalListings is read here (closure) so the progress bar reflects the
    // actual number of listings that will be deleted, not the site-wide total.
    const filteredTotal = Math.max(totalListings, 1);
    const batchProgressStep = (BATCH_LIMIT / filteredTotal) * 100;

    // Reset deletion state
    setDeletionState({
      offset: 0,
      totalDeleted: 0,
      totalFailed: 0,
      isDeleting: true,
      progress: 0,
      isCompleted: false,
      error: '',
      log: []
    });

    let batchNumber = 0;
    let allDeleted = 0;

    /**
     * Process deletion in batches.
     *
     * IMPORTANT: offset is always 0 for every request.
     * Unlike update operations (SetCoordinates, RunListingUpdate), deletions
     * remove posts from the database. After each batch the remaining posts
     * shift to position 0 in the query result, so sending offset > 0 on the
     * next call would skip over those posts and terminate too early.
     */
    const processBatch = async () => {
      try {
        const response = await apiFetch({
          path: `${window.dba_data.restUrl}/delete/listings`,
          method: 'POST',
          data: {
            offset: 0,
            limit: BATCH_LIMIT,
            category: filterOptions.category,
            directory_types: filterOptions.directory,
            status: filterOptions.status,
            users: filterOptions.users,
            type: deletionConfig.type,
            metas: deletionConfig.metas,
            media: deletionConfig.media,
          }
        });

        // Handle API errors
        if (response?.status === 'error') {
          setDeletionState(prev => ({
            ...prev,
            error: response.message || 'An error occurred during deletion',
            isDeleting: false
          }));
          return;
        }

        // Handle server-reported completion
        if (response?.status === 'completed') {
          setDeletionState(prev => ({
            ...prev,
            isCompleted: true,
            isDeleting: false
          }));
          return;
        }

        const postsCount = response?.posts?.length || 0;
        const deletedCount = response?.deleted?.length || 0;
        const failedCount = postsCount - deletedCount;

        batchNumber += 1;

        // Update log
        setDeletionState(prev => ({
          ...prev,
          log: [...prev.log, `Batch ${batchNumber}: ${deletedCount}/${postsCount} deleted.`]
        }));

        // No more posts match the filters — all done
        if (postsCount === 0) {
          setDeletionState(prev => ({
            ...prev,
            isCompleted: true,
            isDeleting: false
          }));
          return;
        }

        // Update counters
        allDeleted += deletedCount;

        setDeletionState(prev => ({
          ...prev,
          totalDeleted: allDeleted,
          totalFailed: prev.totalFailed + failedCount,
          progress: Math.min(100, prev.progress + batchProgressStep)
        }));

        // Continue to next batch
        processBatch();

      } catch (error) {
        console.error('Batch processing error:', error);
        setDeletionState(prev => ({
          ...prev,
          log: [...prev.log, `Error in batch ${batchNumber + 1}: ${error.message}`],
          isDeleting: false
        }));
      }
    };

    processBatch();
  }, [filterOptions, deletionConfig, totalListings]);

  return (
    <div className="coordinators-wrapper all-import-wrapper">
      <h3>Delete Listings</h3>
      <p className="note">
        Please select the options to delete the listings in your website.
      </p>
      
      {deletionState.error && (
        <div className="error" role="alert">
          {deletionState.error}
        </div>
      )}

      <div className="delete-fields">
        <DirectoryTypes
          options={dropdownOptions.directories}
          onChange={(selected) => handleFilterChange('directory', selected)}
        />
        
        <CategorySelect
          options={dropdownOptions.categories}
          onChange={(selected) => handleFilterChange('category', selected)}
        />
        
        <StatusSelect
          options={dropdownOptions.statuses}
          onChange={(selected) => handleFilterChange('status', selected)}
        />
        
        <UserSelect
          options={dropdownOptions.users}
          onChange={(selected) => handleFilterChange('users', selected)}
        />
        
        <DeleteTypeSelector 
          onChange={(value) => setDeletionConfig(prev => ({ ...prev, type: value }))} 
        />
        
        <DeleteMediaOptions 
          onChange={(selected) => setDeletionConfig(prev => ({ ...prev, media: selected }))} 
        />
        
        <DeleteMetasField 
          onChange={(data) => setDeletionConfig(prev => ({ ...prev, metas: data }))} 
        />
        
        {totalListings !== null && (
          <p className="error">
            Total Listings to be Deleted: <strong>{totalListings}</strong>
          </p>
        )}
      </div>

      <button
        className="update-coordinates delete-listings"
        onClick={handleDelete}
        disabled={deletionState.isDeleting || totalListings < 1}
        type="button"
        aria-label={deletionState.isDeleting ? 'Deleting listings...' : 'Start deletion process'}
      >
        {deletionState.isDeleting ? 'Deleting...' : 'Start Delete'}
      </button>

      {deletionState.progress > 0 && (
        <div className="progress-bar" role="progressbar" aria-valuenow={deletionState.progress} aria-valuemin="0" aria-valuemax="100">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${Math.min(100, deletionState.progress)}%` }}
          />
        </div>
      )}

      {deletionState.totalDeleted > 0 && (
        <p className="coordinator-status">
          Total Deleted: <strong>{deletionState.totalDeleted}</strong>
        </p>
      )}
      
      {deletionState.totalFailed > 0 && (
        <p className="coordinator-status">
          Total Failed: <strong>{deletionState.totalFailed}</strong>
        </p>
      )}
      
      {deletionState.isCompleted && (
        <p className="coordinator-status" style={{ color: 'green' }}>
          ✅ All listings deleted!
        </p>
      )}

      {deletionState.log.length > 0 && (
        <div className="coordinator-log" role="log" aria-live="polite">
          {[...deletionState.log].reverse().map((entry, index) => (
            <div key={index}>- {entry}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteListings;