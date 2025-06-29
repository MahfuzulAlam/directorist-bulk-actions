import React from 'react';
import { saveAs } from 'file-saver';

const ExportTaxonomies = () => {

  const exportTaxonomies = async ( taxonomy = 'category' ) => {
    try {
      const response = await fetch(`${window.dba_data.restUrl}` + `/export/taxonomies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.dba_data.nonce,
        },
        body: JSON.stringify({ taxonomy: taxonomy })
      });

      const data = await response.json();

      console.log( data );

      if (data.status != 'success') throw new Error('Failed to fetch categories');

      const categories = data.terms ? data.terms : [];

      const headers = [
        'id', 'name', 'slug', 'description', 'parent_slug', 'category_icon', '_directory_type', 'image',
      ];

      const csvRows = [
        headers.join(','),
        ...categories.map(cat => headers.map(h => {
          const value = cat[h];
          return `"${String(value ?? '').replace(/"/g, '""')}"`;
        }).join(','))
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${taxonomy}.csv`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div>
      <div>Export Taxonomies</div>
      <button onClick={()=>exportTaxonomies('location')}>Export Categories</button>
    </div>
  )

}

export default ExportTaxonomies;