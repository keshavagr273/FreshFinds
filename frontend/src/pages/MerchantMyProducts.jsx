import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const MerchantMyProducts = ({ onNavigate }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  const origin = baseURL.replace(/\/api$/, '')

  const fetchMine = async () => {
    const startedAt = Date.now()
    try {
      // Fetch all products, then filter by current merchant id
      const res = await axios.get(`${baseURL}/products?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const mine = (res.data?.data || []).filter(p => p.merchant?._id === currentUser?._id)
      setProducts(mine)
    } catch (e) {
      toast.error('Failed to load products')
    } finally {
      // Ensure loader is shown for at least 1 second
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, 1000 - elapsed)
      setTimeout(() => setLoading(false), remaining)
    }
  }

  useEffect(() => {
    fetchMine()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Deleted')
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Products</h1>
          <a href="#" onClick={(e)=>{e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' })}} className="text-sm text-purple-600">Top</a>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh] w-full">
            <div className="inline-flex items-center gap-4 text-slate-600">
              <span className="w-12 h-12 rounded-full border-4 border-slate-300 border-t-purple-600 animate-spin"></span>
              <span className="text-lg font-semibold">Loading your products…</span>
            </div>
          </div>
        ) : (
          products.length === 0 ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📦</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-1">No products yet</h2>
                <p className="text-slate-500 mb-4">Start by adding your first product to showcase in your store.</p>
                <button onClick={() => onNavigate && onNavigate('merchant-add-product')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Product</button>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p._id} className="border rounded-xl p-4 bg-white border-slate-200">
                <div className="aspect-video bg-slate-100 rounded-lg mb-3 overflow-hidden">
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].url.startsWith('http') ? p.images[0].url : `${origin}${p.images[0].url}` } alt={p.images[0].alt || p.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No image</div>
                  )}
                </div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-slate-500">{p.category} • {p.stock?.quantity} {p.stock?.unit}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-lg font-bold">${p.price}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MerchantMyProducts


