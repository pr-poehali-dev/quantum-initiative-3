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
  const [projectsList, setProjectsList] = useState<Project[]>(projects)
  const [isAdding, setIsAdding] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const mediaType: MediaType = file.type.startsWith('video/') ? 'video' : 'image'
    const mediaUrl = URL.createObjectURL(file)

    const newProject: Project = {
      id: Date.now(),
      title: "Новое изделие",
      category: "Категория",
      location: "Описание",
      year: new Date().getFullYear().toString(),
      media: mediaUrl,
      mediaType,
    }

    setProjectsList([newProject, ...projectsList])
    setIsAdding(false)
  }

  const handleRemoveProject = (id: number) => {
    setProjectsList(projectsList.filter(p => p.id !== id))
  }

  const handleUpdateProject = (id: number, field: keyof Project, value: string) => {
    setProjectsList(projectsList.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

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
            />
            <div className="text-center">
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
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projectsList.map((project, index) => (
            <article
              key={project.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div ref={(el) => (imageRefs.current[index] = el)} className="relative overflow-hidden aspect-[4/3] mb-6">
                {project.mediaType === "video" ? (
                  <video
                    src={project.media}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
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
                    className={`w-full h-full object-cover transition-transform duration-700 ${
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
                <div className="flex-1">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleUpdateProject(project.id, 'title', e.target.value)}
                    className="text-xl font-medium mb-2 bg-transparent border-none outline-none focus:underline underline-offset-4 w-full"
                    placeholder="Название изделия"
                  />
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <input
                      type="text"
                      value={project.category}
                      onChange={(e) => handleUpdateProject(project.id, 'category', e.target.value)}
                      className="bg-transparent border-none outline-none focus:underline underline-offset-2"
                      placeholder="Категория"
                    />
                    <span>·</span>
                    <input
                      type="text"
                      value={project.location}
                      onChange={(e) => handleUpdateProject(project.id, 'location', e.target.value)}
                      className="bg-transparent border-none outline-none focus:underline underline-offset-2"
                      placeholder="Описание"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={project.year}
                    onChange={(e) => handleUpdateProject(project.id, 'year', e.target.value)}
                    className="text-muted-foreground/60 text-sm bg-transparent border-none outline-none focus:underline underline-offset-2 w-16 text-right"
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
    </section>
  )
}