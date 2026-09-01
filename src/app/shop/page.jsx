'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import Spinner from '@/components/Spinner'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      
      // Build query
      let query = supabase.from('products').select('*').eq('is_active', true)
      
      // Apply category filter if present
      if (categoryFilter) {
        query = query.ilike('category', categoryFilter)
      }
      
      const { data } = await query
      
      // Also fetch categories for the filter bar
      const { data: catData } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true)

      setProducts(data || [])
      
      // Get unique categories
      const uniqueCats = [...new Set(catData?.map(p => p.category).filter(Boolean))]
      setCategories(uniqueCats)
      setLoading(false)
    }
    fetchProducts()
  }, [categoryFilter])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <main className="container shop-page">
      <h1>
        {categoryFilter 
          ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}` 
          : 'All Products'
        }
      </h1>

      {/* Category Filter Bar */}
      <div className="filter-bar">
        <Link 
          href="/shop" 
          className={`filter-btn ${!categoryFilter ? 'active' : ''}`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link 
            key={cat}
            href={`/shop?category=${cat.toLowerCase()}`}
            className={`filter-btn ${categoryFilter === cat.toLowerCase() ? 'active' : ''}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <p className="no-products">No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}