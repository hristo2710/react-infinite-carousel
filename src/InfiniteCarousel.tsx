import { useRef, useEffect, useState, useLayoutEffect } from 'react'
import './InfiniteCarousel.css'

type InfiniteCarouselProps = {
  images: string[]
}

function InfiniteCarousel({ images }: InfiniteCarouselProps) {
  // References for the carousel element and persistent mutable values
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const pendingScrollAdjustment = useRef(0)
  const hasInitialized = useRef(false)

  // State for the current starting position in the image collection
  const [startIndex, setStartIndex] = useState(0)

  // Configuration for the rendered window and buffer sizes
  const visibleCount = 10
  const bufferSize = 5
  const windowSize = visibleCount + bufferSize * 2
  
  const hasImages = images && images.length > 0

  // Build the rendered image window around the current start index
  const visibleImages = hasImages ? Array.from(
    { length: windowSize },
    (_, index) => {
      const imageIndex = (startIndex - bufferSize + index + images.length) % images.length
      return images[imageIndex]
    }) : []
    
  // Initialize the carousel scroll position on first render
  useEffect(() => {
    // Attach a wheel event listener to convert vertical scrolling into horizontal scrolling
    function handleWheel(event: WheelEvent) {
      event.preventDefault()

      const carousel = carouselRef.current
      if (!carousel) return

      carousel.scrollLeft += event.deltaY
    }

    const carousel = carouselRef.current
    if (!carousel) return

    // Add the wheel event listener to the carousel
    carousel.addEventListener('wheel', handleWheel, {
      // Required to allow preventDefault in the wheel event handler, the scroll must work horizontally instead of vertically
      passive: false
    })

    // Clean up the wheel event listener on component unmount
    return () => {
      carousel.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Keep the scroll position visually stable when the rendered window changes
  useLayoutEffect(() => {
    // Get references to the carousel and the first image for calculations
    const carousel = carouselRef.current
    if(!carousel) return

    const firstImage = carousel.children[0] as HTMLImageElement
    if(!firstImage) return

    // Calculate the width of one carousel item including the gap
    const gap = parseFloat(getComputedStyle(carousel).gap)
    const itemWidth = firstImage.offsetWidth + gap

    // Start after the left buffer on the first render
    if(!hasInitialized.current) {
      carousel.scrollLeft = itemWidth * bufferSize
      hasInitialized.current = true
      return
    }

    // Compensate for the shifted render window without a visible jump
    if(pendingScrollAdjustment.current !== 0) {
      carousel.scrollLeft += pendingScrollAdjustment.current
      pendingScrollAdjustment.current = 0
    }
  }, [startIndex])

  // Update the rendered window as the user scrolls
  function handleScroll() {
    const carousel = carouselRef.current
    if (!carousel) return

    const firstImage = carousel.children[0] as HTMLImageElement
    if(!firstImage) return

    const gap = parseFloat(getComputedStyle(carousel).gap)
    const itemWidth = firstImage.offsetWidth + gap

    // Shift the rendered window forward
    if(carousel.scrollLeft >= itemWidth * (bufferSize + 1)) {
      pendingScrollAdjustment.current = -itemWidth
      setStartIndex((currentIndex) => {
        return (currentIndex + 1) % images.length
      })
    }

    // Shift the rendered window backward
    if(carousel.scrollLeft <= itemWidth * (bufferSize - 1)) {
      pendingScrollAdjustment.current = itemWidth
      setStartIndex((currentIndex) => {
        return (currentIndex - 1 + images.length) % images.length
      })
    }
  }

  return (
    <div 
        className="carousel"
        ref={carouselRef}
        onScroll={handleScroll}
    >
      {visibleImages.map((image, index) => (
        <img 
            className="carousel-image"
            key={index} 
            src={image} 
            alt={`Carousel ${index + 1}`} 
            loading="lazy"
        />
      ))}
    </div>
  )
}

export default InfiniteCarousel