import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Header } from "../components/Header"
import { Hero } from "../components/Hero"
import { Philosophy } from "../components/Philosophy"
import { Catalog } from "../components/Catalog"
import { Projects } from "../components/Projects"
import { Blog } from "../components/Blog"
import { Footer } from "../components/Footer"
import { ShareButton } from "../components/ShareButton"

export default function Index() {
  const location = useLocation();

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('blogScrollPosition');
    
    if (savedPosition) {
      sessionStorage.removeItem('blogScrollPosition');
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
      }, 100);
    } else if (location.state?.scrollToBlog) {
      setTimeout(() => {
        const blogElement = document.getElementById('blog');
        if (blogElement) {
          blogElement.scrollIntoView({ block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Philosophy />
      <Catalog />
      <Projects />
      <Blog />
      <Footer />
      <ShareButton />
    </main>
  )
}