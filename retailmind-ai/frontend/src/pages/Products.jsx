import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, deleteProduct } from '../api/products';
import { Modal } from '../components/Modal';
import { Package, Plus, Search, Trash2, Tag, DollarSign, Filter } from 'lucide-react';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    product_name: '',
    category: 'Dairy',
    brand: '',
    unit_price: '25.50',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProductList = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ search, category: categoryFilter });
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.warn('Backend connection failed, loading mock product catalog:', err);
      setProducts([
        { id: 1, sku: 'FMCG-DRK-001', product_name: 'Organic Almond Milk 1L', category: 'Beverages', brand: 'NutriPure', unit_price: '4.50' },
        { id: 2, sku: 'FMCG-DRK-002', product_name: 'Cold Brew Coffee 250ml', category: 'Beverages', brand: 'BeanCraft', unit_price: '3.20' },
        { id: 3, sku: 'FMCG-SNK-005', product_name: 'Dark Chocolate Bar 85g', category: 'Snacks', brand: 'CocoaCraft', unit_price: '2.80' },
        { id: 4, sku: 'FMCG-DRY-010', product_name: 'Greek Yogurt Vanilla 500g', category: 'Dairy', brand: 'FarmFresh', unit_price: '5.10' },
        { id: 5, sku: 'FMCG-HSH-003', product_name: 'Eco Laundry Liquid 1.5L', category: 'Household', brand: 'CleanLeaf', unit_price: '12.99' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, [search, categoryFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProduct(formData);
      setIsModalOpen(false);
      setFormData({ sku: '', product_name: '', category: 'Dairy', brand: '', unit_price: '25.50' });
      fetchProductList();
    } catch (err) {
      alert('Failed to create product: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product SKU?')) return;
    try {
      await deleteProduct(id);
      fetchProductList();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">FMCG Product Catalog</h2>
          <p className="text-xs text-slate-400">Manage Master Stock Keeping Units (SKUs) and Pricing</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, product name, or brand..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Categories</option>
            <option value="Beverages">Beverages</option>
            <option value="Dairy">Dairy</option>
            <option value="Snacks">Snacks</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Household">Household</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">SKU Code</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Unit Price ($)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    Loading product catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono text-emerald-400 font-semibold">{item.sku}</td>
                    <td className="p-4 font-semibold text-white">{item.product_name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] bg-slate-800 text-slate-300 font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{item.brand}</td>
                    <td className="p-4 font-semibold text-white">${parseFloat(item.unit_price).toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Delete Product SKU"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New FMCG Product SKU"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">SKU Code</label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="FMCG-DAIRY-099"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              placeholder="Fresh Cheddar Cheese 200g"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Beverages">Beverages</option>
                <option value="Dairy">Dairy</option>
                <option value="Snacks">Snacks</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Household">Household</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Brand Name</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="FarmFresh"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Unit Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
              placeholder="4.99"
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
              {submitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
