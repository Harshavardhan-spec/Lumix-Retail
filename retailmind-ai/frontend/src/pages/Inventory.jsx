import React, { useState, useEffect } from 'react';
import { getInventory, createInventory, updateInventory } from '../api/inventory';
import { getProducts } from '../api/products';
import { Modal } from '../components/Modal';
import { StockAlertBadge } from '../components/StockAlertBadge';
import { Warehouse, Plus, Search, Edit2, AlertTriangle, RefreshCw } from 'lucide-react';

export const Inventory = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    current_stock: 100,
    reorder_level: 25,
    warehouse: 'North-WH-01',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [invData, prodData] = await Promise.all([
        getInventory({ warehouse: warehouseFilter }),
        getProducts(),
      ]);

      const items = Array.isArray(invData) ? invData : invData.results || [];
      setInventoryList(items);
      setProductList(Array.isArray(prodData) ? prodData : prodData.results || []);

      if (items.length > 0 && !formData.product) {
        setFormData((prev) => ({ ...prev, product: items[0].product }));
      }
    } catch (err) {
      console.warn('Backend offline, displaying demo inventory items:', err);
      setInventoryList([
        { id: 1, product: 1, product_detail: { sku: 'FMCG-DAIRY-001', product_name: 'Fresh Milk 1L', category: 'Dairy', brand: 'FarmFresh' }, current_stock: 5, reorder_level: 50, warehouse: 'North-WH-01', is_low_stock: true },
        { id: 2, product: 2, product_detail: { sku: 'FMCG-BEV-004', product_name: 'Sparkling Soda 500ml', category: 'Beverages', brand: 'FizzPop' }, current_stock: 350, reorder_level: 100, warehouse: 'Central-Hub', is_low_stock: false },
        { id: 3, product: 3, product_detail: { sku: 'FMCG-SNK-012', product_name: 'Potato Chips 100g', category: 'Snacks', brand: 'Crunchy' }, current_stock: 12, reorder_level: 40, warehouse: 'South-WH-02', is_low_stock: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, [warehouseFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createInventory(formData);
      setIsModalOpen(false);
      fetchInventoryData();
    } catch (err) {
      alert('Error creating stock entry: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await updateInventory(id, { current_stock: newStock });
      fetchInventoryData();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Warehouse Inventory & Reorder Control</h2>
          <p className="text-xs text-slate-400">Track stock levels across regional distribution hubs</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stock Entry</span>
        </button>
      </div>

      {/* Warehouse Filter */}
      <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Warehouse className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium text-slate-300">Filter Warehouse:</span>
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Regional Warehouses</option>
            <option value="North-WH-01">North Distribution Hub (North-WH-01)</option>
            <option value="Central-Hub">Central Main Hub (Central-Hub)</option>
            <option value="South-WH-02">South Fulfillment Hub (South-WH-02)</option>
          </select>
        </div>

        <button
          onClick={fetchInventoryData}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Reload"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Inventory Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Product SKU</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Warehouse</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Reorder Point</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    Loading inventory details...
                  </td>
                </tr>
              ) : inventoryList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No inventory records found for selected warehouse.
                  </td>
                </tr>
              ) : (
                inventoryList.map((item) => {
                  const prod = item.product_detail || {};
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono text-emerald-400 font-semibold">{prod.sku || `PRD-${item.product}`}</td>
                      <td className="p-4 font-semibold text-white">{prod.product_name || 'FMCG Product Item'}</td>
                      <td className="p-4 font-mono text-slate-300">{item.warehouse}</td>
                      <td className="p-4 font-bold text-lg text-white">{item.current_stock}</td>
                      <td className="p-4 text-slate-400 font-medium">{item.reorder_level} units</td>
                      <td className="p-4">
                        {item.is_low_stock ? (
                          <StockAlertBadge severity={item.current_stock === 0 ? 'CRITICAL' : 'WARNING'} count={item.current_stock} />
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Stock Healthy
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => handleStockUpdate(item.id, Math.max(0, item.current_stock - 10))}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-semibold"
                            title="Subtract 10 Units"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleStockUpdate(item.id, item.current_stock + 50)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-emerald-400 font-semibold"
                            title="Add 50 Units"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Inventory Entry"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Product</label>
            <select
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {productList.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.sku}] {p.product_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Stock (Units)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.current_stock}
                onChange={(e) => setFormData({ ...formData, current_stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Reorder Point Threshold</label>
              <input
                type="number"
                required
                min="1"
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Warehouse Location Code</label>
            <input
              type="text"
              required
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
              placeholder="North-WH-01"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Add Stock Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
