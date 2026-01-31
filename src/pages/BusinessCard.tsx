import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function BusinessCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [contacts] = useState({
    phone1: '+7 929 309-08-98',
    phone2: '+7 923 370-88-82',
    email: 'KAV089824@MAIL.RU',
    telegram: '@ANDERSONKOV'
  });

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

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        ctx.drawImage(logoImg, 80, 80, 120, 120);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('Natural Masterpieces', 220, 130);

        ctx.fillStyle = '#d4af37';
        ctx.font = '24px Arial';
        ctx.fillText('From Capa and Suvela', 220, 170);

        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText('📞 ' + contacts.phone1, 80, 260);
        ctx.fillText('📞 ' + contacts.phone2, 80, 295);
        ctx.fillText('✉️ ' + contacts.email, 80, 330);
        ctx.fillText('💬 ' + contacts.telegram, 80, 365);

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
      logoImg.src = 'https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/4954ecf4-452a-4f03-baff-e809ab12201b.png';
    };
    woodImg.src = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80';
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
            className="aspect-[1.75/1] rounded-lg overflow-hidden relative"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80&v=2)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#654321'
            }}
          >
            <div className="absolute inset-4 border-4 border-[#d4af37] rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <div 
                className="absolute inset-1 p-8 flex items-center justify-between"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80&v=2)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#654321'
                }}
              >
                <div className="space-y-4">
                  <div>
                    <img 
                      src="https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/4954ecf4-452a-4f03-baff-e809ab12201b.png" 
                      alt="Natural Masterpieces" 
                      className="w-32 h-32 mb-3"
                    />
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Natural Masterpieces
                    </h2>
                    <p className="text-lg text-[#d4af37]">
                      From Capa and Suvela
                    </p>
                  </div>
                  <div className="space-y-1 text-white text-sm">
                    <p>📞 {contacts.phone1}</p>
                    <p>📞 {contacts.phone2}</p>
                    <p>✉️ {contacts.email}</p>
                    <p>💬 {contacts.telegram}</p>
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