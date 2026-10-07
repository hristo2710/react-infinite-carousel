import InfiniteCarousel from './InfiniteCarousel'

// Sample images for the carousel
const images = Array.from(
  { length: 1000 },
  (_, index) => `https://picsum.photos/seed/${index + 1}/600/400`
)

function App() {
  return (
    <div>
      <h1>Infinite image carousel</h1>
      <p>by Hristo Atanasov</p>
      <InfiniteCarousel images={images} />
    </div>
  )
}

export default App