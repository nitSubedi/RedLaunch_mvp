"use client";
import React, { useState, useEffect } from 'react';
import GridView from './gridView';
import TableView from './tableView';
import { fetchInventory, fetchUsageTrend, add_Inventory,logUsage,restockItem } from '@/app/lib/apiClient';
import { InventoryItem } from './types';
import './styles.css'
import ItemDetailModal from './ItemDetailModal';
import RestockModal from './restockModal';
import LogUsageModal from './logUsageModal';

function PredictiveInvPage() {
  const [isGridView, setIsGridView] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    category: '',
    stock: 0,
    optimal: 0,
    location: '',
    color: '#38bdf8',
    supplier: '',
    leadTime: 7,
  });

  // Modal state
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [restockItemTarget, setRestockItemTarget] = useState<InventoryItem | null>(null);
  const [restockLoading, setRestockLoading] = useState(false);

  // Usage log modal state
  const [usageLogModalOpen, setUsageLogModalOpen] = useState(false);
  const [usageLogItemTarget, setUsageLogItemTarget] = useState<InventoryItem | null>(null);
  const [usageLogLoading, setUsageLogLoading] = useState(false);



  useEffect(() => {
    loadInventory();
  }, []);

  // Filter inventory based on search
  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchFilter.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [inventory, searchFilter]);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchInventory();
      const itemsWithTrend: InventoryItem[] = await Promise.all(
          data.inventory.map(async (item: { id: string; item_name?: string; name?: string; category?: string; stock_level?: number; stock?: number; location?: string; last_updated?: string; optimal?: number; color?: string; lead_time?: number; supplier?: string }) => {
          const trendData = await fetchUsageTrend(item.id);
          return {
            id: item.id.toString(),
            category: item.item_name || item.name || item.category,
            stock: item.stock_level || item.stock,
            location: item.location || 'Unknown',
            optimal: item.optimal || 100,
            color: item.color || '#38bdf8',
            lastUpdated: item.last_updated || new Date().toISOString(),
            supplier: item.supplier, 
            leadTime: item.lead_time || 7,
            usageTrend: trendData.trend || [0, 0, 0, 0, 0, 0, 0],
          };
        })
      );

      setInventory(itemsWithTrend);
    } catch (err) {
      setError('Failed to load inventory data');
      console.error('Error loading inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(inventory)
  const refreshInventory = () => {
    loadInventory();
  };


  // Handle item click to open modal
  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle restock action
 const handleRestock = (item: InventoryItem) => {
    setRestockItemTarget(item);
    setRestockModalOpen(true);
  };

  // Handle usage log action
  const handleAddUsageLog = (item: InventoryItem) => {
    setUsageLogItemTarget(item);
    setUsageLogModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleRestockSubmit = async (itemId: string, quantity: number) => {
    setRestockLoading(true);
    try {
      await restockItem(Number(itemId), quantity);
      await loadInventory();
      setRestockModalOpen(false);
      setRestockItemTarget(null);
    } catch (err) {
      alert("Failed to restock item. Please try again.");
    } finally {
      setRestockLoading(false);
    }
  };

  const handleUsageLogSubmit = async (itemId: string, quantity: number, notes: string) => {
    setUsageLogLoading(true);
    try {
      // Replace 1 with actual user id if available
      await logUsage(Number(itemId), 1, quantity, notes);
      await loadInventory();
      setUsageLogModalOpen(false);
      setUsageLogItemTarget(null);
    } catch (err) {
      alert("Failed to log usage. Please try again.");
    } finally {
      setUsageLogLoading(false);
    }
  };

   const handleRestockModalClose = () => {
    setRestockModalOpen(false);
    setRestockItemTarget(null);
  };

  const handleUsageModalClose = () => {
    setUsageLogModalOpen(false);
    setUsageLogItemTarget(null);
  };


  // helper function to add inventory 
  const handleAddItem = async () => {
    // Basic validation
    if (!newItem.category.trim() || newItem.optimal <= 0) {
      setFormError('Please fill in all required fields. Category is required and optimal stock must be greater than 0.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      // Prepare data for API call
      const itemData = {
        item_name: newItem.category,
        stock_level: newItem.stock,
        location: newItem.location || 'Unknown',
        last_updated: new Date().toISOString(),
        optimal: newItem.optimal,
        color: newItem.color,
        lead_time: newItem.leadTime,
        supplier: newItem.supplier || 'Unknown'

      };

      // Call API to add item
      const response = await add_Inventory(itemData.item_name, itemData.stock_level, itemData.location, itemData.last_updated, itemData.optimal, itemData.color, itemData.lead_time, itemData.supplier);

      // If successful, refresh the entire inventory to get the new item with proper ID
      await loadInventory();

      // Reset form
      setNewItem({
        category: '',
        stock: 0,
        location: '',
        optimal: 0,
        color: '#38bdf8',
        supplier: '',
        leadTime: 7,
      });
      setShowAddForm(false);

    } catch (err) {
      setError('Failed to add new inventory item. Please try again.');
      console.error('Error adding inventory item:', err);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleCancelAdd = () => {
    setNewItem({
      category: '',
      stock: 0,
      optimal: 0,
      location: '',
      color: '#38bdf8',
      supplier: '',
      leadTime: 7,
    });
    setShowAddForm(false);
    setFormError(null);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Predictive Inventory Management System</h1>
        <div className="view-toggle">
          <button
            onClick={() => setIsGridView(true)}
            disabled={isGridView}
          >
            Grid View
          </button>
          <button
            onClick={() => setIsGridView(false)}
            disabled={!isGridView}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by category or supplier..."
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
        />
        <span className="search-results">
          Showing {filteredInventory.length} of {inventory.length} items
        </span>
      </div>

      {/* Conditional Main Content */}
      <div>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading inventory data...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
            <button className="btn btn-primary mt-2" onClick={loadInventory}>
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Stats Panel */}
            <div className="stats-panel">
              <div className="stat-card">
                <div className="stat-label">Total Items</div>
                <div className="stat-value">{inventory.length}</div>
              </div>
              <div className="stat-card stat-critical">
                <div className="stat-label">Critical Items</div>
                <div className="stat-value">{filteredInventory.filter(item => item.stock < item.optimal * 0.7).length}</div>
              </div>
              <div className="stat-card stat-warning">
                <div className="stat-label">Item Need Restock</div>
                <div className="stat-value">{filteredInventory.filter(item => item.stock < item.optimal).length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Last Updated</div>
                <div className="stat-value" style={{ fontSize: '1rem' }}>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div>
              {filteredInventory.length === 0 ? (
                <div className="empty-state">
                  <h3>No inventory items found</h3>
                  {searchFilter && <p>Try adjusting your search filter</p>}
                </div>
              ) : (
                <>
                  {isGridView ? (
                    <GridView
                      inventory={filteredInventory}
                      onItemClick={handleItemClick}
                      onRestock={handleRestock}
                      onAddUsage={handleAddUsageLog}
                    />
                  ) : (
                    <TableView
                      inventory={filteredInventory}
                      onItemClick={handleItemClick}
                      onRestock={handleRestock}
                      onAddUsage={handleAddUsageLog}
                    />
                  )}
                </>
              )}
              <button className="btn btn-secondary mt-3 mb-2" onClick={refreshInventory}>
                🔄 Refresh Data
              </button>
            </div>
          </>
        )}
      </div>

      {/* Add New Item Section */}
      <div className='add-new-item'>
        {!showAddForm ? (
          <button className="btn btn-primary mt-2" onClick={() => setShowAddForm(true)}>
            + Add New Inventory Item
          </button>
        ) : (
          <div className="form-container">
            <h3>Register New Inventory Item</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>

              <div className="form-group">
                <label>Current Stock</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={newItem.stock}
                  onChange={e => setNewItem({ ...newItem, stock: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Optimal Stock *</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={newItem.optimal}
                  onChange={e => setNewItem({ ...newItem, optimal: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  className="form-input"
                  value={newItem.supplier}
                  onChange={e => setNewItem({ ...newItem, supplier: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={newItem.location}
                  onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="Enter the location"
                />
              </div>

              <div className="form-group">
                <label>Lead Time (days)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={newItem.leadTime}
                  onChange={e => setNewItem({ ...newItem, leadTime: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  className="form-input"
                  value={newItem.color}
                  onChange={e => setNewItem({ ...newItem, color: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" disabled={isLoading} onClick={handleCancelAdd}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={isLoading} onClick={handleAddItem}>
                Add Item
              </button>
            </div>
            {formError &&
              <div className="error-container mt-2">
                <p>Error: {formError}</p>
              </div>
            }
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    <RestockModal
        isOpen={restockModalOpen}
        onClose={handleRestockModalClose}
        item={restockItemTarget}
        onSubmit={handleRestockSubmit}
        isLoading={restockLoading}
      />

      {/* Usage Log Modal */}
      <LogUsageModal
        isOpen={usageLogModalOpen}
        onClose={handleUsageModalClose}
        item={usageLogItemTarget}
        onSubmit={handleUsageLogSubmit}
        isLoading={usageLogLoading}
      />
    </div>
  );
}

export default PredictiveInvPage;

