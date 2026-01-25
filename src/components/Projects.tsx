import { useState, useEffect, useRef } from "react"
import Icon from "@/components/ui/icon"

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

const projects: Project[] = [
  {
    id: 1,
    title: "Настенные панно",
    category: "Декор интерьера",
    location: "Резьба по дереву",
    year: "2024",
    media: "/images/hously-1.png",
    mediaType: "image",
  },
  {
    id: 2,
    title: "Деревянные часы",
    category: "Аксессуары",
    location: "Ручная работа",
    year: "2024",
    media: "/images/hously-2.png",
    mediaType: "image",
  },
  {
    id: 3,
    title: "Подарочные наборы",
    category: "Сувениры",
    location: "Коллекция 2024",
    year: "2024",
    media: "/images/hously-3.png",
    mediaType: "image",
  },
  {
    id: 4,
    title: "Кухонные доски",
    category: "Функциональный декор",
    location: "Дуб и орех",
    year: "2024",
    media: "/images/hously-4.png",
    mediaType: "image",
  },
]

export function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const saved = localStorage.getItem('woodcraft-projects')
    return saved ? JSON.parse(saved) : projects
  })
  const [isAdding, setIsAdding] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem('woodcraft-projects', JSON.stringify(projectsList))
  }, [projectsList])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].id))
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
  }, [])

  const handleAddProject = () => {
    setIsAdding(true)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setIsAdding(false)
      return
    }

    const mediaType: MediaType = file.type.startsWith('video/') ? 'video' : 'image'
    setIsUploading(true)
    
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const base64Data = event.target?.result as string
        
        const response = await fetch('https://functions.poehali.dev/34876a78-f76d-4862-8d89-f950c302216f', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64Data,
            type: file.type
          })
        })
        
        if (!response.ok) throw new Error('Upload failed')
        
        const data = await response.json()
        
        const newProject: Project = {
          id: Date.now(),
          title: "Новое изделие",
          category: "Категория",
          location: "Описание",
          year: new Date().getFullYear().toString(),
          media: data.url,
          mediaType,
        }

        setProjectsList([newProject, ...projectsList])
        setRevealedImages((prev) => new Set(prev).add(newProject.id))
        setIsAdding(false)
        setIsUploading(false)
        
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        console.error('Upload error:', error)
        setIsAdding(false)
        setIsUploading(false)
        alert('Ошибка загрузки файла')
      }
    }
    
    reader.readAsDataURL(file)
  }

  const handleRemoveProject = (id: number) => {
    setProjectsList(projectsList.filter(p => p.id !== id))
  }

  const handleUpdateProject = (id: number, field: keyof Project, value: string) => {
    setProjectsList(projectsList.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

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

  return (
    <section id="projects" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Портфолио</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Наши изделия</h2>
          </div>
          <button
            onClick={handleAddProject}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group px-4 py-2 rounded-lg hover:bg-secondary/50"
          >
            <Icon name="Plus" size={16} />
            Добавить изделие
          </button>
        </div>

        {isAdding && (
          <div className="mb-8 p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-secondary/30">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <div className="text-center">
              {isUploading ? (
                <>
                  <Icon name="Loader2" size={48} className="mx-auto mb-4 text-muted-foreground animate-spin" />
                  <p className="text-lg mb-2">Загрузка...</p>
                  <p className="text-sm text-muted-foreground">Пожалуйста, подождите</p>
                </>
              ) : (
                <>
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg mb-2">Загрузите фото или видео</p>
                  <p className="text-sm text-muted-foreground mb-6">Поддерживаются форматы: JPG, PNG, MP4, WebM</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Выбрать файл
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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
                className="relative overflow-hidden aspect-[4/3] mb-6 bg-secondary cursor-pointer"
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
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleUpdateProject(project.id, 'title', e.target.value)}
                    className="text-2xl md:text-3xl font-medium mb-3 bg-transparent border-none outline-none focus:underline underline-offset-4 w-full"
                    placeholder="Название изделия"
                  />
                  <div className="flex flex-col gap-1.5 text-base md:text-lg text-muted-foreground">
                    <input
                      type="text"
                      value={project.category}
                      onChange={(e) => handleUpdateProject(project.id, 'category', e.target.value)}
                      className="bg-transparent border-none outline-none focus:underline underline-offset-2 w-full"
                      placeholder="Категория"
                    />
                    <input
                      type="text"
                      value={project.location}
                      onChange={(e) => handleUpdateProject(project.id, 'location', e.target.value)}
                      className="bg-transparent border-none outline-none focus:underline underline-offset-2 w-full"
                      placeholder="Описание"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={project.year}
                    onChange={(e) => handleUpdateProject(project.id, 'year', e.target.value)}
                    className="text-muted-foreground/60 text-base bg-transparent border-none outline-none focus:underline underline-offset-2 w-16 text-right"
                    placeholder="2024"
                  />
                  <button
                    onClick={() => handleRemoveProject(project.id)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    title="Удалить"
                  >
                    <Icon name="Trash2" size={16} className="text-destructive" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" 
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            title="Закрыть (Esc)"
          >
            <Icon name="X" size={32} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            title="Предыдущее (←)"
          >
            <Icon name="ChevronLeft" size={40} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            title="Следующее (→)"
          >
            <Icon name="ChevronRight" size={40} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full z-10">
            <button
              onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={zoom <= 1}
              title="Уменьшить"
            >
              <Icon name="ZoomOut" size={24} />
            </button>
            <span className="text-white py-2 px-3 min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={zoom >= 3}
              title="Увеличить"
            >
              <Icon name="ZoomIn" size={24} />
            </button>
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-lg bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {projectsList.length}
          </div>

          <div 
            className="max-w-[90vw] max-h-[90vh] overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStartDrag}
            onTouchMove={handleTouchMoveDrag}
            onTouchEnd={handleTouchEndDrag}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            {projectsList[currentImageIndex]?.mediaType === 'video' ? (
              <video
                src={projectsList[currentImageIndex].media}
                className="max-w-full max-h-[90vh] object-contain select-none"
                style={{ 
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s'
                }}
                controls
                autoPlay
                loop
                draggable={false}
              />
            ) : (
              <img
                src={projectsList[currentImageIndex]?.media}
                alt={projectsList[currentImageIndex]?.title}
                className="max-w-full max-h-[90vh] object-contain select-none"
                style={{ 
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s'
                }}
                draggable={false}
              />
            )}
          </div>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white max-w-2xl px-6">
            <h3 className="text-2xl font-medium mb-2">{projectsList[currentImageIndex]?.title}</h3>
            <p className="text-lg text-white/70">{projectsList[currentImageIndex]?.category}</p>
            <p className="text-base text-white/60 mt-1">{projectsList[currentImageIndex]?.location}</p>
          </div>
        </div>
      )}
    </section>
  )
}