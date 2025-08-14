import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ReelsPlayer from '@/components/reels/ReelsPlayer';
import UploadReels from '@/components/reels/UploadReels';
import { ReelsUploadData } from '@/types/reels';

const ReelsPage = () => {
  const [showUpload, setShowUpload] = useState(false);

  const handleUpload = (data: ReelsUploadData) => {
    console.log('Uploading reel:', data);
    alert('Reels успешно загружен! 🎉');
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Main Reels Player */}
      <ReelsPlayer />

      {/* Upload Button */}
      <div className="fixed top-4 right-4 z-40">
        <Button
          onClick={() => setShowUpload(true)}
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg"
        >
          <Icon name="Plus" size={20} className="mr-2" />
          Создать
        </Button>
      </div>

      {/* Upload Modal */}
      <UploadReels
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
      />

      {/* Info Overlay */}
      <div className="fixed bottom-4 left-4 z-30 text-white/70 text-xs bg-black/50 rounded-lg p-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Icon name="ArrowUp" size={12} />
            <span>Предыдущее видео</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="ArrowDown" size={12} />
            <span>Следующее видео</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-white/20 rounded text-center text-xs leading-4">
              Space
            </div>
            <span>Пауза/Воспроизведение</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsPage;