import { useState, useEffect, useRef } from "react"
import Icon from "@/components/ui/icon"

const MEDIA_API = 'https://functions.poehali.dev/bf44cf81-0850-473e-92c5-6da7b70c3c07'

type MediaType = 'image' | 'video'

interface Project {
  id: number
  title: string
  category: string
  location: string
  year: string
  media: string
  mediaType: MediaType
}

export function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [projectsList, setProjectsList] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch(`${MEDIA_API}?limit=20`)
      const data = await response.json()
      
      const items = data.items || (Array.isArray(data) ? data : [])
      
      // Загрузить url для каждого медиа
      const projectsWithUrls = await Promise.all(
        items.map(async (item: any) => {
          try {
            const urlResponse = await fetch(`${MEDIA_API}?id=${item.id}`)
            const urlData = await urlResponse.json()
            return {
              id: item.id,
              title: item.title || 'Без названия',
              category: item.category || 'Категория',
              location: item.location || 'Описание',
              year: item.year || new Date().getFullYear().toString(),
              media: urlData.url || '',
              mediaType: item.media_type as MediaType,
            }
          } catch (error) {
            console.error(`Failed to load url for item ${item.id}:`, error)
            return {
              id: item.id,
              title: item.title || 'Без названия',
              category: item.category || 'Категория',
              location: item.location || 'Описание',
              year: item.year || new Date().getFullYear().toString(),
              media: '',
              mediaType: item.media_type as MediaType,
            }
          }
        })
      )
      
      setProjectsList(projectsWithUrls)
      if (projectsWithUrls.length > 0) {
        setRevealedImages(new Set([projectsWithUrls[0].id]))
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1 && projectsList[index]) {
              setRevealedImages((prev) => new Set(prev).add(projectsList[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [projectsList])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectsList.length)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectsList.length) % projectsList.length)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }

  const handleDoubleClick = () => {
    if (zoom > 1) {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setZoom(2)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    setZoom((prev) => {
      const newZoom = Math.min(Math.max(prev + delta, 1), 3)
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStartDrag = (e: React.TouchEvent) => {
    if (zoom <= 1) {
      setTouchStart(e.targetTouches[0].clientX)
      return
    }
    setIsDragging(true)
    setDragStart({
      x: e.targetTouches[0].clientX - position.x,
      y: e.targetTouches[0].clientY - position.y
    })
  }

  const handleTouchMoveDrag = (e: React.TouchEvent) => {
    if (zoom <= 1) {
      setTouchEnd(e.targetTouches[0].clientX)
      return
    }
    if (!isDragging) return
    setPosition({
      x: e.targetTouches[0].clientX - dragStart.x,
      y: e.targetTouches[0].clientY - dragStart.y
    })
  }

  const handleTouchEndDrag = () => {
    setIsDragging(false)
    if (zoom <= 1 && touchStart && touchEnd) {
      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > 50
      const isRightSwipe = distance < -50

      if (isLeftSwipe) nextImage()
      if (isRightSwipe) prevImage()

      setTouchStart(0)
      setTouchEnd(0)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen])

  if (loading) {
    return (
      <section id="projects" className="py-32 md:py-29 bg-secondary/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-center items-center py-20">
            <Icon name="Loader2" className="animate-spin" size={48} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Портфолио</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Наши изделия</h2>
          </div>
          <a
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group px-4 py-2 rounded-lg hover:bg-secondary/50"
          >
            <Icon name="Lock" size={16} />
            Админ-панель
          </a>
        </div>

        {projectsList.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="ImageOff" size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Галерея пуста</p>
            <p className="text-sm mt-2">Добавьте фото через админ-панель</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {projectsList.map((project, index) => (
              <article
                key={project.id}
                className="group"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div 
                  ref={(el) => (imageRefs.current[index] = el)} 
                  className="relative overflow-hidden aspect-[4/3] mb-6 bg-muted cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  {project.mediaType === "video" ? (
                    <video
                      src={project.media}
                      className={`w-full h-full object-contain transition-transform duration-700 ${
                        hoveredId === project.id ? "scale-105" : "scale-100"
                      }`}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={project.media || "/placeholder.svg"}
                      alt={project.title}
                      className={`w-full h-full object-contain transition-transform duration-700 ${
                        hoveredId === project.id ? "scale-105" : "scale-100"
                      }`}
                    />
                  )}
                  <div
                    className="absolute inset-0 bg-primary origin-top"
                    style={{
                      transform: revealedImages.has(project.id) ? "scaleY(0)" : "scaleY(1)",
                      transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                    }}
                  />
                  {project.mediaType === "video" && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                      <Icon name="Video" size={16} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl md:text-3xl font-medium mb-3">{project.title}</h3>
                    <div className="flex flex-col gap-1.5 text-base md:text-lg text-muted-foreground">
                      <p>{project.category}</p>
                      <p>{project.location}</p>
                    </div>
                  </div>
                  <span className="text-xl md:text-2xl text-muted-foreground flex-shrink-0">{project.year}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && projectsList.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Закрыть"
          >
            <Icon name="X" size={32} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Предыдущее"
          >
            <Icon name="ChevronLeft" size={48} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Следующее"
          >
            <Icon name="ChevronRight" size={48} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
              aria-label="Уменьшить"
            >
              <Icon name="ZoomOut" size={24} className="text-white" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
              aria-label="Увеличить"
            >
              <Icon name="ZoomIn" size={24} className="text-white" />
            </button>
          </div>

          <div
            className="relative max-w-[90vw] max-h-[90vh] overflow-hidden cursor-move"
            onDoubleClick={handleDoubleClick}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStartDrag}
            onTouchMove={handleTouchMoveDrag}
            onTouchEnd={handleTouchEndDrag}
          >
            {projectsList[currentImageIndex].mediaType === "video" ? (
              <video
                src={projectsList[currentImageIndex].media}
                className="max-w-full max-h-[90vh] object-contain"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                }}
                controls
                autoPlay
                loop
              />
            ) : (
              <img
                src={projectsList[currentImageIndex].media}
                alt={projectsList[currentImageIndex].title}
                className="max-w-full max-h-[90vh] object-contain select-none"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                }}
                draggable={false}
              />
            )}
          </div>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-center">
            <h3 className="text-xl font-medium mb-2">{projectsList[currentImageIndex].title}</h3>
            <p className="text-sm text-gray-300">
              {currentImageIndex + 1} / {projectsList.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}