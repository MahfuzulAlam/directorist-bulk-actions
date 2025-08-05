import { useState, createRoot } from '@wordpress/element';
import Tabs from './components';

const App = () => {
    const [activeTab, setActiveTab] = useState('run_update');

    const tabs = [
        { key: 'export_taxonomies', label: 'Export Taxonomies' },
        { key: 'import_taxonomies', label: 'Import Taxonomies' },
        { key: 'update_listings', label: 'Update Listings' },
        { key: 'delete_listings', label: 'Delete Listings' },
        { key: 'set_coordinates', label: 'Set Coordinates' },
        { key: 'run_update', label: 'Run Update' },
    ];

    return (
        <div className="wrap">
            <h1 className="wp-heading-inline">Directorist - Bulk Actions</h1>

            <div className="tab-wrapper">
                <div className="tab-buttons">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={activeTab === tab.key ? 'active' : ''}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    <p className="warning">
                        Warning: Please do not change the tabs while importing, exporting or updating data.
                    </p>

                    {activeTab === 'set_coordinates' && <Tabs.SetCoordinates isActive />}
                    {activeTab === 'import_taxonomies' && <Tabs.ImportTaxonomies isActive />}
                    {activeTab === 'export_taxonomies' && <Tabs.ExportTaxonomies isActive />}
                    {activeTab === 'delete_listings' && <Tabs.DeleteListings isActive />}
                    {activeTab === 'update_listings' && <Tabs.UpdateListings isActive />}
                    {activeTab === 'run_update' && <Tabs.RunListingUpdate isActive />}
                </div>
            </div>
        </div>
    );
};

document.addEventListener('DOMContentLoaded', () => {
    // Mount only if the target element exists
    const container = document.getElementById('my-react-app');
    if (container) {
        const root = createRoot(container);
        root.render(<App />);
    }
});
