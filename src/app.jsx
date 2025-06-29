import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import UpdateListings from './components/updateListings';
import Coordinators from './components/Coordinators';
import DeleteListings from './components/DeleteListings';
import ImportCategories from './components/ImportCategories';
import ExportTaxonomies from './components/ExportTaxonomies';

const App = () => {

    const [activeTab, setActiveTab] = useState('coordinators');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'coordinators': return <Coordinators />;
            case 'delete_listings': return <DeleteListings />;
            case 'update_listings': return <UpdateListings />;
        }
    };

    return (
        <div className="wrap">
            <h1 className="wp-heading-inline">Directorist - Bulk Actions</h1>
            <p>Welcome to the Directorist Bulk Actions plugin page!</p>
            
            <div className="tab-wrapper">
                <div className="tab-buttons">
                    <button onClick={() => setActiveTab('coordinators')}>Set Coordinators</button>
                    <button onClick={() => setActiveTab('import_categories')}>Import Categories</button>
                    <button onClick={() => setActiveTab('export_taxonomies')}>Export Taxonomies</button>
                    <button onClick={() => setActiveTab('delete_listings')}>Delete Listings</button>
                    <button onClick={() => setActiveTab('update_listings')}>Update Listings</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'coordinators' && <Coordinators isActive={true} />}
                    {activeTab === 'import_categories' && <ImportCategories isActive={true} />}
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
