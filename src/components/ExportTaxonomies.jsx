import React from 'react';
import { saveAs } from 'file-saver';
import apiFetch from '@wordpress/api-fetch';

/**
 * Component: ExportTaxonomies
 * Allows exporting taxonomy terms as a CSV file via a REST API call.
 */
const ExportTaxonomies = () => {

  /**
   * Exports the given taxonomy terms by calling the custom REST API
   * and generating a downloadable CSV file.
   *
   * @param {string} taxonomy - The taxonomy slug to export (e.g., 'category', 'location').
   */
  const exportTaxonomies = async (taxonomy = 'category') => {
    try {
      // Send request to the backend REST API endpoint
      const response = await apiFetch({
        path: `${window.dba_data.restUrl}/export/taxonomies`,
        method: 'POST',
        data: {
          taxonomy,
        }
      });

      console.log(response);

      if (response.status !== 'success') {
        throw new Error('Failed to fetch taxonomy terms');
      }

      const categories = response.terms || [];

      // Define CSV headers
      const headers = [
        'id', 'name', 'slug', 'description', 'parent', 'category_icon', 'directory_type', 'image',
      ];

      // Generate CSV content rows
      const csvRows = [
        headers.join(','),
        ...categories.map(cat =>
          headers.map(h => {
            const value = cat[h];
            return `"${String(value ?? '').replace(/"/g, '""')}"`;
          }).join(',')
        )
      ];

      // Create a Blob and trigger download
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${taxonomy}.csv`);

    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className='export-taxonomy-wrapper all-import-wrapper'>
      <h3>Export Taxonomies</h3>
      <p className="note">Please click the button below to export the CSV file for the selected taxonomy.</p>
      <button onClick={() => exportTaxonomies('category')}>Export Categories</button>
      <button onClick={() => exportTaxonomies('location')}>Export Locations</button>
    </div>
  );
};

export default ExportTaxonomies;
