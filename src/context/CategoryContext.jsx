'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

const CategoryContext = createContext()

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [productCounts, setProductCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      
      try {
        // 1. Fetch all active categories
        const { data: cats, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name')

        if (catError) {
          console.error('❌ Category fetch error:', catError)
          setLoading(false)
          return
        }

        // 2. Fetch all active products (only need category field)
        const { data: products, error: prodError } = await supabase
          .from('products')
          .select('category')
          .eq('is_active', true)

        if (prodError) {
          console.error('❌ Product fetch error:', prodError)
          setCategories(cats || [])
          setLoading(false)
          return
        }

        // 3. Count products per category (case-insensitive)
        const counts = {}
        
        // Initialize all categories with 0
        cats.forEach(cat => {
          counts[cat.slug] = 0
        })

        // Count products that match each category
        products.forEach(product => {
          if (product.category) {
            const productCat = product.category.toLowerCase().trim()
            // Find matching category slug
            const matchedCat = cats.find(c => 
              c.slug.toLowerCase() === productCat
            )
            if (matchedCat) {
              counts[matchedCat.slug] = (counts[matchedCat.slug] || 0) + 1
            }
          }
        })

        console.log('✅ Categories loaded:', cats.length)
        console.log('📊 Counts:', counts)

        setCategories(cats)
        setProductCounts(counts)
      } catch (error) {
        console.error('🔥 Unexpected error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  return (
    <CategoryContext.Provider value={{ categories, productCounts, loading }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider')
  }
  return context
}