import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
          <span>Вернуться на главную</span>
        </Link>

        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg">
          <h1 className="text-4xl font-bold mb-8">Политика конфиденциальности</h1>
          
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Общие положения</h2>
              <p className="leading-relaxed">
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных 
                пользователей сайта Natural Masterpieces. Мы уважаем вашу конфиденциальность и обязуемся 
                защищать личную информацию, которую вы нам предоставляете.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Собираемая информация</h2>
              <p className="leading-relaxed mb-4">При оформлении заказа мы собираем следующую информацию:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Имя и фамилия</li>
                <li>Контактные данные (телефон, Telegram, email или другой способ связи на ваш выбор)</li>
                <li>Комментарии к заказу (по желанию)</li>
                <li>Информация о выбранных товарах</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Цели использования данных</h2>
              <p className="leading-relaxed mb-4">Мы используем вашу персональную информацию для:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Обработки и выполнения заказов</li>
                <li>Связи с вами для уточнения деталей заказа</li>
                <li>Информирования о статусе заказа</li>
                <li>Улучшения качества обслуживания</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Защита данных</h2>
              <p className="leading-relaxed">
                Мы применяем современные технологии для защиты вашей личной информации от несанкционированного 
                доступа, изменения, раскрытия или уничтожения. Все данные передаются по защищенному соединению 
                и хранятся на защищенных серверах.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Передача данных третьим лицам</h2>
              <p className="leading-relaxed">
                Мы не передаем ваши персональные данные третьим лицам, за исключением случаев, необходимых 
                для выполнения заказа (например, службы доставки). Мы не продаем и не сдаем в аренду 
                вашу личную информацию.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Хранение данных</h2>
              <p className="leading-relaxed">
                Мы храним вашу персональную информацию столько времени, сколько необходимо для выполнения 
                целей, указанных в настоящей Политике конфиденциальности, или в соответствии с требованиями 
                законодательства.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Ваши права</h2>
              <p className="leading-relaxed mb-4">Вы имеете право:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Получать информацию о ваших персональных данных, которые мы обрабатываем</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Отозвать согласие на обработку персональных данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Cookies</h2>
              <p className="leading-relaxed">
                Наш сайт может использовать cookies для улучшения пользовательского опыта. Вы можете 
                настроить ваш браузер для отказа от cookies, однако это может ограничить функциональность сайта.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Изменения в политике</h2>
              <p className="leading-relaxed">
                Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. 
                Обновленная версия будет размещена на этой странице с указанием даты последнего обновления.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Контакты</h2>
              <p className="leading-relaxed">
                Если у вас есть вопросы относительно нашей Политики конфиденциальности или обработки 
                ваших персональных данных, пожалуйста, свяжитесь с нами через форму заказа на сайте.
              </p>
            </section>

            <div className="pt-8 border-t border-border">
              <p className="text-sm">
                Дата последнего обновления: {new Date().toLocaleDateString('ru-RU', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
