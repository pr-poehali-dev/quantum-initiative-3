import { useState } from "react"
import Icon from "@/components/ui/icon"

interface OrderFormProps {
  isOpen: boolean
  selectedProduct: { index: number; name: string; telegram: string; productNumber?: string } | null
  onClose: () => void
  onSubmit: (data: {
    customerName: string
    contactMethod: string
    contactValue: string
    orderComment: string
    privacyAccepted: boolean
  }) => void
}

export function OrderForm({ isOpen, selectedProduct, onClose, onSubmit }: OrderFormProps) {
  const [customerName, setCustomerName] = useState('')
  const [contactMethod, setContactMethod] = useState('telegram')
  const [contactValue, setContactValue] = useState('')
  const [orderComment, setOrderComment] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit({
      customerName,
      contactMethod,
      contactValue,
      orderComment,
      privacyAccepted
    })
    setCustomerName('')
    setContactValue('')
    setContactMethod('telegram')
    setOrderComment('')
    setPrivacyAccepted(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg p-6 max-w-md w-full my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Оформление заказа</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {selectedProduct && (
          <p className="text-muted-foreground mb-4 text-sm">
            {selectedProduct.productNumber ? `№${selectedProduct.productNumber}` : `№${selectedProduct.index + 1}`}. {selectedProduct.name}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Ваше имя</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Иван"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Как с вами связаться?</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setContactMethod('telegram')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  contactMethod === 'telegram' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <Icon name="MessageCircle" size={16} className="inline mr-1" />
                Telegram
              </button>
              <button
                type="button"
                onClick={() => setContactMethod('phone')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  contactMethod === 'phone' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <Icon name="Phone" size={16} className="inline mr-1" />
                Телефон
              </button>
              <button
                type="button"
                onClick={() => setContactMethod('email')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  contactMethod === 'email' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <Icon name="Mail" size={16} className="inline mr-1" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setContactMethod('other')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  contactMethod === 'other' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <Icon name="MessageSquare" size={16} className="inline mr-1" />
                Другое
              </button>
            </div>
            <input
              type={contactMethod === 'email' ? 'email' : 'text'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={
                contactMethod === 'telegram' ? '@username или +7 999 123-45-67' :
                contactMethod === 'phone' ? '+7 999 123-45-67' :
                contactMethod === 'email' ? 'example@mail.ru' :
                'VK, WhatsApp, другой способ связи'
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Комментарий (необязательно)</label>
            <textarea
              value={orderComment}
              onChange={(e) => setOrderComment(e.target.value)}
              placeholder="Пожелания по доставке, вопросы или другие детали..."
              rows={2}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-md">
            <input
              type="checkbox"
              id="privacy-checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 w-6 h-6 md:w-4 md:h-4 accent-primary cursor-pointer flex-shrink-0"
            />
            <label htmlFor="privacy-checkbox" className="text-sm text-muted-foreground cursor-pointer">
              Я согласен с{' '}
              <a 
                href="/privacy" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                политикой конфиденциальности
              </a>
              {' '}и даю согласие на обработку персональных данных
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!privacyAccepted}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отправить заказ
          </button>
        </div>
      </div>
    </div>
  )
}
