'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import CategorySection from '@/components/CategorySection'
import HeroBanner from '@/components/HeroBanner'
import EmailSignup from '@/components/EmailSignup'
import Testimonials from '@/components/Testimonials'
import ScrollBanner from '@/components/ScrollBanner'
import { useInView } from 'react-intersection-observer'
import Spinner from '@/components/Spinner'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryCounts, setCategoryCounts] = useState({})
  const [loading, setLoading] = useState(true)

  const [featuredRef, featuredInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
      
      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (productData) {
        setProducts(productData)
        const counts = {}
        productData.forEach(p => {
          const cat = p.category?.toLowerCase() || 'uncategorized'
          counts[cat] = (counts[cat] || 0) + 1
        })
        setCategoryCounts(counts)
      }
      
      if (categoryData) setCategories(categoryData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const getProductsByCategory = (slug) => {
    return products.filter(p => p.category?.toLowerCase() === slug.toLowerCase())
  }

  const activeCategories = categories.filter(cat => {
    const count = categoryCounts[cat.slug] || 0
    return count >= 2
  })

  const getRandomProducts = (arr, count = 8) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const featuredProducts = getRandomProducts(products, 8)
  const directions = ['left', 'right', 'left', 'right', 'left']

  const midPoint = Math.ceil(activeCategories.length / 2)
  const firstHalf = activeCategories.slice(0, midPoint)
  const secondHalf = activeCategories.slice(midPoint)

  return (
    <main>
      <HeroBanner />
      
      {/* Featured Products */}
      <section ref={featuredRef} className={`featured scroll-section container ${featuredInView ? 'visible' : ''}`}>
        <h2>Featured Picks</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* First Half of Scrolling Categories */}
      {!loading && firstHalf.length > 0 && (
        <>
          {firstHalf.map((category, index) => {
            const catProducts = getProductsByCategory(category.slug)
            return (
              <CategorySection
                key={category.id}
                title={category.name}
                icon={category.icon || '📦'}
                products={catProducts}
                direction={directions[index % directions.length]}
                backgroundImage={category.background_image}
                slug={category.slug}
              />
            )
          })}
        </>
      )}

      <ScrollBanner />

      {/* Second Half of Scrolling Categories */}
      {!loading && secondHalf.length > 0 && (
        <>
          {secondHalf.map((category, index) => {
            const catProducts = getProductsByCategory(category.slug)
            return (
              <CategorySection
                key={category.id}
                title={category.name}
                icon={category.icon || '📦'}
                products={catProducts}
                direction={directions[(index + midPoint) % directions.length]}
                backgroundImage={category.background_image}
                slug={category.slug}
              />
            )
          })}
        </>
      )}

      <EmailSignup />
      <Testimonials />
    </main>
  )
}