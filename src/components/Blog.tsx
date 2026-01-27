import { motion } from "framer-motion"
import Icon from '@/components/ui/icon'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  image: string
  category: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Что такое кап берёзы и почему он так ценится",
    excerpt: "Кап — это уникальное образование на стволе дерева с неповторимой текстурой. Узнайте, почему изделия из капа считаются эксклюзивными и как отличить настоящий кап от подделки.",
    date: "20 января 2026",
    readTime: "5 мин",
    image: "https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/11b7dd00-3d28-4bd4-9313-c4fc415dddb9.png",
    category: "Материалы"
  },
  {
    id: "2",
    title: "Сувель: отличия от капа и особенности обработки",
    excerpt: "Сувель обладает особой переливающейся структурой, напоминающей мрамор. Рассказываем о секретах работы с этим редким материалом и его преимуществах.",
    date: "18 января 2026",
    readTime: "6 мин",
    image: "https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/11b7dd00-3d28-4bd4-9313-c4fc415dddb9.png",
    category: "Материалы"
  },
  {
    id: "3",
    title: "Как ухаживать за изделиями из дерева: гид по долговечности",
    excerpt: "Правильный уход продлит жизнь вашим деревянным сувенирам на десятилетия. Простые правила чистки, хранения и восстановления блеска натурального дерева.",
    date: "15 января 2026",
    readTime: "4 мин",
    image: "https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/9f79e38c-7906-48ed-bc3f-8d89d21c19af.png",
    category: "Уход"
  },
  {
    id: "4",
    title: "5 причин выбрать деревянные сувениры вместо фабричных подарков",
    excerpt: "Уникальность, экологичность, энергетика натурального дерева. Почему hand-made подарки из капа ценятся выше массового производства и как выбрать идеальный сувенир.",
    date: "12 января 2026",
    readTime: "5 мин",
    image: "https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/cd53b59c-7e6b-4d91-81ef-3b764f8cfbf1.png",
    category: "Подарки"
  },
  {
    id: "5",
    title: "От дерева до шедевра: процесс создания изделия из капа",
    excerpt: "За каждым изделием — месяцы сушки, часы шлифовки и годы мастерства. Рассказываем обо всех этапах превращения сырого нароста в произведение искусства.",
    date: "8 января 2026",
    readTime: "7 мин",
    image: "https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/cd53b59c-7e6b-4d91-81ef-3b764f8cfbf1.png",
    category: "Процесс"
  }
]

export function Blog() {
  const handleReadArticle = (postId: string) => {
    alert(`Открытие статьи ${postId}. Здесь будет полный текст статьи.`)
  }

  const handleAllArticles = () => {
    alert('Здесь будет страница со всеми статьями блога.')
  }

  return (
    <section id="blog" className="py-20 bg-wood-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-wood-dark mb-4">
            Блог о деревянных изделиях
          </h2>
          <p className="text-lg text-wood-medium max-w-2xl mx-auto">
            Полезные статьи о капе, сувели и секретах работы с натуральным деревом
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-wood-dark text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-wood-medium mb-3">
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" size={16} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={16} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="font-heading text-xl text-wood-dark mb-3 hover:text-wood-accent transition-colors">
                  {post.title}
                </h3>

                <p className="text-wood-medium mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <button 
                  onClick={() => handleReadArticle(post.id)}
                  className="inline-flex items-center gap-2 text-wood-accent font-medium hover:gap-3 transition-all"
                >
                  Читать статью
                  <Icon name="ArrowRight" size={18} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button 
            onClick={handleAllArticles}
            className="bg-wood-accent text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all inline-flex items-center gap-2"
          >
            Все статьи блога
            <Icon name="BookOpen" size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}