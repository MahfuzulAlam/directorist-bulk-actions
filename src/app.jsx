import { useState, createRoot, lazy, Suspense } from '@wordpress/element';

import './style.css';

/**
 * Tab panels are lazy-loaded so each tool's code (and its heavy vendors —
 * SweetAlert2, react-select, PapaParse, FileSaver) is fetched only when the
 * tab is opened. Keeps the initial bundle down to the app shell.
 */
const UpdateListings   = lazy(() => import('./components/UpdateListings'));
const ExportTaxonomies = lazy(() => import('./components/ExportTaxonomies'));
const ImportTaxonomies = lazy(() => import('./components/ImportTaxonomies'));
const DeleteListings   = lazy(() => import('./components/DeleteListings'));
const SetCoordinates   = lazy(() => import('./components/SetCoordinates'));
const RunListingUpdate = lazy(() => import('./components/RunListingUpdate'));

const ICONS = {
    update_listings: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <polyline points="21 3 21 9 15 9" />
        </svg>
    ),
    export_taxonomies: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    ),
    import_taxonomies: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    ),
    delete_listings: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
    ),
    set_coordinates: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    run_update: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
};

const TABS = [
    { key: 'update_listings', label: 'Update Listings', hint: 'Bulk update from CSV', component: UpdateListings },
    { key: 'export_taxonomies', label: 'Export Taxonomies', hint: 'Download terms as CSV', component: ExportTaxonomies },
    { key: 'import_taxonomies', label: 'Import Taxonomies', hint: 'Create or update terms', component: ImportTaxonomies },
    { key: 'delete_listings', label: 'Delete Listings', hint: 'Filtered bulk removal', component: DeleteListings },
    { key: 'set_coordinates', label: 'Set Coordinates', hint: 'Geocode addresses', component: SetCoordinates },
    { key: 'run_update', label: 'Run Update', hint: 'Custom hook runner', component: RunListingUpdate },
];

/** Skeleton shown while a tab's chunk is being fetched. */
const TabSkeleton = () => (
    <div className="dba-skeleton" aria-hidden="true">
        <div className="dba-skeleton-line dba-skeleton-title" />
        <div className="dba-skeleton-line" />
        <div className="dba-skeleton-line short" />
        <div className="dba-skeleton-block" />
    </div>
);

const App = () => {
    const [activeTab, setActiveTab] = useState('update_listings');
    const active = TABS.find((tab) => tab.key === activeTab) || TABS[0];
    const ActivePanel = active.component;
    const version = window.dba_data?.version;

    return (
        <div className="wrap directorist-bulk-actions-admin">
            <div className="dba-app">
                <header className="dba-header">
                    <div className="dba-header-titles">
                        <h1 className="dba-title">
                            Bulk Actions
                            {version && <span className="dba-version">v{version}</span>}
                        </h1>
                        <p className="dba-subtitle">Batch tools for your Directorist listings and taxonomies</p>
                    </div>
                    <div className="dba-header-meta">
                        <span className="dba-stat">
                            <strong>{window.dba_data?.totalListings ?? 0}</strong> listings
                        </span>
                    </div>
                </header>

                <div className="dba-global-notice" role="note">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>Please do not switch tabs or close this page while an operation is running.</span>
                </div>

                <div className="dba-body">
                    <nav className="dba-nav" aria-label="Bulk action tools">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                className={`dba-nav-item${activeTab === tab.key ? ' active' : ''}${tab.key === 'delete_listings' ? ' danger' : ''}`}
                                aria-current={activeTab === tab.key ? 'page' : undefined}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                <span className="dba-nav-icon">{ICONS[tab.key]}</span>
                                <span className="dba-nav-text">
                                    <span className="dba-nav-label">{tab.label}</span>
                                    <span className="dba-nav-hint">{tab.hint}</span>
                                </span>
                            </button>
                        ))}
                    </nav>

                    <main className="dba-content tab-content">
                        <Suspense fallback={<TabSkeleton />}>
                            <ActivePanel isActive />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
};

document.addEventListener('DOMContentLoaded', () => {
    // Mount only if the target element exists
    const container = document.getElementById('directorist-bulk-actions-admin');
    if (container) {
        const root = createRoot(container);
        root.render(<App />);
    }
});
