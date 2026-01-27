import { Header } from "../components/Header"
import { Hero } from "../components/Hero"
import { Philosophy } from "../components/Philosophy"
import { Catalog } from "../components/Catalog"
import { Projects } from "../components/Projects"
import { CallToAction } from "../components/CallToAction"
import { Footer } from "../components/Footer"
import { ShareButton } from "../components/ShareButton"

export default function Index() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Philosophy />
      <Catalog />
      <Projects />
      <CallToAction />
      <Footer />
      <ShareButton />
    </main>
  )
}