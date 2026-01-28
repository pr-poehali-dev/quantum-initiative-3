import { useNavigate } from "react-router-dom"
import { Blog } from "../components/Blog"
import { Footer } from "../components/Footer"
import Icon from "@/components/ui/icon"

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-wood-light">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-wood-accent hover:gap-3 transition-all mb-4"
        >
          <Icon name="ArrowLeft" size={20} />
          На главную
        </button>
      </div>
      <Blog />
      <Footer />
    </div>
  )
}
