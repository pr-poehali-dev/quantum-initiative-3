import { useEffect } from "react"
import { Header } from "../components/Header"
import { Hero } from "../components/Hero"
import { Philosophy } from "../components/Philosophy"
import { Catalog } from "../components/Catalog"
import { Projects } from "../components/Projects"
import { Blog } from "../components/Blog"
import { Footer } from "../components/Footer"
import { ShareButton } from "../components/ShareButton"

export default function Index() {
  useEffect(() => {
    if (window.location.hash === '#blog') {
      const scrollToBlog = () => {
        const blogElement = document.getElementById('blog');
        if (blogElement) {
          const offset = blogElement.offsetTop - 80;
          window.scrollTo(0, offset);
          
          setTimeout(() => {
            window.scrollTo(0, offset);
          }, 100);
          
          setTimeout(() => {
            window.scrollTo(0, offset);
          }, 300);
        }
      };

      setTimeout(scrollToBlog, 200);
    }
  }, []);

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