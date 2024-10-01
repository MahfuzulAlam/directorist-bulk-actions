<?php
/**
 * Directorist_Bulk_Actions
 * Admin Dashboard Page
 */

?>

<div class="wrap">
    <h1 class="wp-heading-inline">Directorist - Bulk Actions</h1>
    <p>Welcome to the Directorist Bulk Actions plugin page!</p>
    <div>
        <div class="radio-boxes-container">
            <label class="radio-box">
                <input type="radio" name="bulk_action" value="delete_listings">
                <div class="box-content">
                    <span>Delete Listings</span>
                </div>
            </label>
            
            <label class="radio-box">
                <input type="radio" name="bulk_action" value="delete_taxonomies">
                <div class="box-content">
                    <span>Delete Taxonomies</span>
                </div>
            </label>

            <label class="radio-box">
                <input type="radio" name="bulk_action" value="import_taxonomies">
                <div class="box-content">
                    <span>Import Taxonomies</span>
                </div>
            </label>

            <label class="radio-box">
                <input type="radio" name="bulk_action" value="export_taxonomies">
                <div class="box-content">
                    <span>Export Taxonomies</span>
                </div>
            </label>
        </div>
    </div>
</div>