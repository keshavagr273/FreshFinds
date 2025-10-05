import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const MerchantMyProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  const origin = baseURL.replace(/\/api$/, '')

  const fetchMine = async () => {
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
      setLoading(false)
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
          <div>Loading...</div>
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
        )}
      </div>
    </div>
  )
}

export default MerchantMyProducts


