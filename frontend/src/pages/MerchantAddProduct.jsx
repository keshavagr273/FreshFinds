import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const MerchantAddProduct = ({ onNavigate }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    category: 'fruits',
    quantity: '',
    unit: 'piece',
    imageFiles: []
  })
  const [dragActive, setDragActive] = useState(false)
  const token = useMemo(() => localStorage.getItem('token') || '', [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFiles = (eOrFiles) => {
    const filesList = Array.isArray(eOrFiles) ? eOrFiles : Array.from(eOrFiles.target.files || [])
    const files = filesList.slice(0, 5)
    setForm(prev => ({ ...prev, imageFiles: files }))
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer?.files?.length) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }
  const onDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    if (e.type === 'dragleave') setDragActive(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!token || token.split('.').length !== 3) {
        toast.error('Session expired. Please log in again.')
        onNavigate && onNavigate('login')
        return
      }
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      const data = new FormData()
      data.append('name', form.name)
      data.append('description', form.description)
      data.append('price', String(form.price))
      if (form.discount !== '' && form.discount !== null && form.discount !== undefined) {
        data.append('discount', String(form.discount))
      }
      data.append('category', form.category)
      // backend expects stock.quantity and stock.unit nested; express.urlencoded supports dot notation
      data.append('stock.quantity', String(form.quantity))
      data.append('stock.unit', form.unit)
      form.imageFiles.forEach(f => data.append('images', f))

      await axios.post(`${baseURL}/products`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Product created successfully')
      onNavigate && onNavigate('merchant-my-products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-2xl overflow-hidden mb-4 bg-white border border-slate-200">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Add Product</h1>
            <p className="text-slate-600 text-sm">Upload images and provide clear product information.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg p-2" rows={4} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="w-full border rounded-lg p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg p-2">
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="bakery">Bakery</option>
                <option value="protein">Protein</option>
                <option value="pantry">Pantry</option>
                <option value="beverages">Beverages</option>
                <option value="snacks">Snacks</option>
                <option value="frozen">Frozen</option>
                <option value="organic">Organic</option>
              </select>
            </div>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Discount (%)</label>
            <input name="discount" type="number" min="0" max="100" step="1" value={form.discount} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="e.g. 10" />
          </div>
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} className="w-full border rounded-lg p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange} className="w-full border rounded-lg p-2">
                <option value="piece">piece</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="dozen">dozen</option>
                <option value="liter">liter</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>
          <div onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag} onDrop={onDrop} className={`rounded-xl border-2 ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-dashed border-slate-300'} p-4 text-center`}>
            <label className="block text-sm font-medium mb-2">Images</label>
            <input id="file-input" type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            <div className="text-slate-600 text-sm">
              Drag & drop images here, or
              <button type="button" className="ml-1 text-purple-600 font-medium" onClick={() => document.getElementById('file-input')?.click()}>browse</button>
            </div>
            {form.imageFiles.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {form.imageFiles.map((f, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="pt-2 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90">Create</button>
            <button type="button" className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200" onClick={() => onNavigate && onNavigate('merchant-my-products')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MerchantAddProduct


