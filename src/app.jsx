import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import UpdateListings from './components/updateListings';
import SetCoordinates from './components/SetCoordinates';
import DeleteListings from './components/DeleteListings';
import ImportTaxonomies from './components/ImportTaxonomies';
import ExportTaxonomies from './components/ExportTaxonomies';

const App = () => {

    const [activeTab, setActiveTab] = useState('set_coordinates');

    return (
        <div className="wrap">
            <h1 className="wp-heading-inline">Directorist - Bulk Actions</h1>

            <div className="tab-wrapper">
                <div className="tab-buttons">
                    <button
                        className={activeTab === 'set_coordinates' ? 'active' : ''}
                        onClick={() => setActiveTab('set_coordinates')}
                    >
                        Set Coordinates
                    </button>
                    <button
                        className={activeTab === 'import_taxonomies' ? 'active' : ''}
                        onClick={() => setActiveTab('import_taxonomies')}
                    >
                        Import Taxonomies
                    </button>
                    <button
                        className={activeTab === 'export_taxonomies' ? 'active' : ''}
                        onClick={() => setActiveTab('export_taxonomies')}
                    >
                        Export Taxonomies
                    </button>
                    {/* <button
                        className={activeTab === 'delete_listings' ? 'active' : ''}
                        onClick={() => setActiveTab('delete_listings')}
                    >
                        Delete Listings
                    </button>
                    <button
                        className={activeTab === 'update_listings' ? 'active' : ''}
                        onClick={() => setActiveTab('update_listings')}
                    >
                        Update Listings
                    </button> */}
                </div>


                <div className="tab-content">
                    <p className="warning">Warning: Please do not change the tabs while importing, exporting or updating data.</p>
                    {activeTab === 'set_coordinates' && <SetCoordinates isActive={true} />}
                    {activeTab === 'import_taxonomies' && <ImportTaxonomies isActive={true} />}
                    {activeTab === 'export_taxonomies' && <ExportTaxonomies isActive={true} />}
                    {activeTab === 'delete_listings' && <DeleteListings isActive={true} />}
                    {activeTab === 'update_listings' && <UpdateListings isActive={true} />}
                </div>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('my-react-app'));
root.render(<App />);
