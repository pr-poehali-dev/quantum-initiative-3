import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Header } from "../components/Header"
import { Hero } from "../components/Hero"
import { Philosophy } from "../components/Philosophy"
import { Process } from "../components/Process"
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
      
      window.history.scrollRestoration = 'manual';
      
      const scrollToPosition = () => {
        window.scrollTo({ top: parseInt(savedPosition), behavior: 'auto' });
      };
      
      requestAnimationFrame(() => {
        setTimeout(scrollToPosition, 0);
        setTimeout(scrollToPosition, 50);
        setTimeout(scrollToPosition, 150);
        setTimeout(scrollToPosition, 300);
      });
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
      <Process />
      <Projects />
      <Catalog />
      <Blog />
      <Footer />
      <ShareButton />
    </main>
  )
}