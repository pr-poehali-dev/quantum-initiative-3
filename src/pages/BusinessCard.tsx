import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function BusinessCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = 'https://suvelewood.online';
        const dataUrl = await QRCode.toDataURL(url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Ошибка генерации QR-кода:', err);
      }
    };

    generateQR();
  }, []);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1050;
    canvas.height = 600;

    const woodImg = new Image();
    woodImg.crossOrigin = 'anonymous';
    woodImg.onload = () => {
      ctx.drawImage(woodImg, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#d4af37';
      ctx.fillRect(40, 40, 970, 520);

      ctx.drawImage(woodImg, 45, 45, 960, 510, 45, 45, 960, 510);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('Сувениры ручной работы', 80, 120);

    ctx.fillStyle = '#d4af37';
    ctx.font = '32px Arial';
    ctx.fillText('Уникальные изделия от мастеров', 80, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('📍 Наш каталог:', 80, 260);
    ctx.fillText('📱 Смотрите все товары онлайн', 80, 310);
    ctx.fillText('✨ Более 100 уникальных изделий', 80, 360);

      if (qrDataUrl) {
        const qrImage = new Image();
        qrImage.onload = () => {
          ctx.drawImage(qrImage, 750, 180, 220, 220);
          
          ctx.fillStyle = '#d4af37';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Сканируйте', 860, 430);
          ctx.fillText('для просмотра', 860, 460);
          
          const link = document.createElement('a');
          link.download = 'vizitka-suvenirov.png';
          link.href = canvas.toDataURL();
          link.click();
        };
        qrImage.src = qrDataUrl;
      }
    };
    woodImg.src = 'https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/files/6eedbe48-4330-4642-877e-f435a3d2d9ca.jpg';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Визитка магазина</h1>
          <p className="text-muted-foreground">
            Визитная карточка с QR-кодом для быстрого доступа к каталогу
          </p>
        </div>

        <div className="bg-card border rounded-lg p-8 space-y-6">
          <div 
            className="aspect-[1.75/1] rounded-lg overflow-hidden relative bg-[#3d2817]"
            style={{
              backgroundImage: 'url(https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/files/6eedbe48-4330-4642-877e-f435a3d2d9ca.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#3d2817'
            }}
          >
            <div className="absolute inset-4 border-4 border-[#d4af37] rounded-lg">
              <div 
                className="absolute inset-1 p-8 flex items-center justify-between bg-[#3d2817]"
                style={{
                  backgroundImage: 'url(https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/files/6eedbe48-4330-4642-877e-f435a3d2d9ca.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#3d2817'
                }}
              >
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Сувениры ручной работы
                    </h2>
                    <p className="text-xl text-[#d4af37]">
                      Уникальные изделия от мастеров
                    </p>
                  </div>
                  <div className="space-y-2 text-white">
                    <p className="text-lg">📍 Наш каталог:</p>
                    <p className="text-base">📱 Смотрите все товары онлайн</p>
                    <p className="text-base">✨ Более 100 уникальных изделий</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  {qrDataUrl && (
                    <>
                      <img
                        src={qrDataUrl}
                        alt="QR код"
                        className="w-48 h-48 bg-white p-2 rounded"
                      />
                      <div className="text-center">
                        <p className="text-[#d4af37] font-bold text-sm">Сканируйте</p>
                        <p className="text-[#d4af37] font-bold text-sm">для просмотра</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={downloadCard} size="lg" className="gap-2">
              <Download className="w-5 h-5" />
              Скачать визитку
            </Button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Визитка создана автоматически с QR-кодом вашего каталога</p>
          <p>Размер: 105×60 мм (стандартная визитка)</p>
        </div>
      </div>
    </div>
  );
}