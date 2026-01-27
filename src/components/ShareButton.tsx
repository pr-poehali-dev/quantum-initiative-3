import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import Icon from "./ui/icon"

export function ShareButton() {
  const [showQR, setShowQR] = useState(false)
  const currentUrl = window.location.href

  return (
    <>
      <button
        onClick={() => setShowQR(true)}
        className="fixed bottom-6 right-6 z-40 bg-[rgb(251,146,60)] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center gap-2"
        aria-label="Поделиться"
      >
        <Icon name="Share2" size={24} />
      </button>

      {showQR && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-medium text-gray-900">Поделиться сайтом</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Закрыть"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-100 mb-6 flex justify-center">
              <QRCodeSVG
                value={currentUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-center text-gray-600 text-sm mb-4">
              Отсканируйте QR-код, чтобы открыть сайт на телефоне
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl)
                  alert("Ссылка скопирована!")
                }}
                className="flex-1 bg-gray-100 text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium"
              >
                Скопировать ссылку
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
