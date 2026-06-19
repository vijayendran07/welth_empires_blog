import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category', error);
      alert('Failed to save category. Please check the console.');
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This might affect articles linked to it.')) return;
    
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete category', error);
      alert('Failed to delete category.');
    }
  };

  const openNewModal = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-display-xl text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight mb-2 leading-tight">
            Sector <span className="text-[#0052cc] italic font-normal">Categories</span>
          </h2>
          <p className="text-gray-500 text-[14px] mt-1">Organize your publications</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-[#0052cc] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0040a3] transition-all shadow-sm hover:shadow-md text-[14px]"
        >
          <FiPlus className="text-[18px]" />
          New Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 pl-6 text-gray-500 uppercase tracking-widest text-[11px] font-bold">Category Name</th>
                <th className="p-4 text-gray-500 uppercase tracking-widest text-[11px] font-bold">Description</th>
                <th className="p-4 text-gray-500 uppercase tracking-widest text-[11px] font-bold">Articles</th>
                <th className="p-4 pr-6 text-gray-500 uppercase tracking-widest text-[11px] font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading categories...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No categories found.</td></tr>
              ) : (
                categories.map(category => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-[15px] text-gray-900 group-hover:text-[#0052cc] transition-colors">{category.name}</p>
                      <p className="text-[12px] text-gray-400 mt-1 font-mono">{category.slug}</p>
                    </td>
                    <td className="p-4 text-[13.5px] text-gray-500 max-w-xs truncate">
                      {category.description || '-'}
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-[12px] text-gray-600 font-bold border border-gray-200">
                        {category._count?.articles || 0}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 bg-white border border-gray-200 shadow-sm rounded-lg hover:text-[#0052cc] hover:border-[#0052cc] transition-all"
                          title="Edit"
                        >
                          <FiEdit2 className="text-[18px]" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 bg-white border border-gray-200 shadow-sm rounded-lg hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <FiTrash2 className="text-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-display-xl text-[24px] font-bold text-gray-900 leading-none">{editingId ? 'Edit Category' : 'Create Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <FiX className="text-[20px]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#0052cc] focus:ring-0 transition-all font-interface-body rounded-xl outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#0052cc] focus:ring-0 transition-all font-interface-body rounded-xl h-24 resize-none outline-none"
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-[14px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#0052cc] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0040a3] transition-colors shadow-sm text-[14px]"
                >
                  {editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;
