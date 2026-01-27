export function Footer() {
  return (
    <footer className="py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="inline-block mb-6">
              <img src="https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/files/333e9cab-349f-4e52-a0ff-195c1edbeb4b.jpg" alt="Студия Декора" className="w-auto h-16 rounded-lg" />
            </a>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Создаем уникальные деревянные изделия ручной работы. Тепло природы в каждом предмете.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium mb-4">Студия</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#projects" className="hover:text-foreground transition-colors">
                  Изделия
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  Философия
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium mb-4">Связь</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:KAV089824@MAIL.RU" className="hover:text-foreground transition-colors">
                  KAV089824@MAIL.RU
                </a>
              </li>
              <li>
                <a href="tel:+79293090898" className="hover:text-foreground transition-colors">
                  +7 929 309-08-98
                </a>
              </li>
              <li>
                <a href="https://t.me/ANDERSONKOV" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Телеграм @ANDERSONKOV
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 Студия Декора. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}