import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { ReelsUploadData } from '@/types/reels';
import { cn } from '@/lib/utils';

interface UploadReelsProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: ReelsUploadData) => void;
  className?: string;
}

const UploadReels = ({
  isOpen,
  onClose,
  onUpload,
  className
}: UploadReelsProps) => {
  const [uploadData, setUploadData] = useState<Partial<ReelsUploadData>>({
    caption: '',
    hashtags: [],
    mentions: [],
    isPrivate: false,
    allowComments: true,
    allowDuet: true,
    allowStitch: true
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [currentHashtag, setCurrentHashtag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Пожалуйста, выберите видеофайл');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('Размер файла не должен превышать 100 МБ');
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handleAddHashtag = () => {
    if (currentHashtag.trim() && !uploadData.hashtags?.includes(`#${currentHashtag.trim()}`)) {
      setUploadData(prev => ({
        ...prev,
        hashtags: [...(prev.hashtags || []), `#${currentHashtag.trim()}`]
      }));
      setCurrentHashtag('');
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    setUploadData(prev => ({
      ...prev,
      hashtags: prev.hashtags?.filter(h => h !== hashtag) || []
    }));
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const simulateProgress = () => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        
        setTimeout(() => {
          onUpload({
            video: videoFile,
            caption: uploadData.caption || '',
            hashtags: uploadData.hashtags || [],
            mentions: uploadData.mentions || [],
            isPrivate: uploadData.isPrivate || false,
            allowComments: uploadData.allowComments ?? true,
            allowDuet: uploadData.allowDuet ?? true,
            allowStitch: uploadData.allowStitch ?? true
          });
          
          handleClose();
        }, 1000);
      }, 3000);
    };

    simulateProgress();
  };

  const handleClose = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setUploadData({
      caption: '',
      hashtags: [],
      mentions: [],
      isPrivate: false,
      allowComments: true,
      allowDuet: true,
      allowStitch: true
    });
    setCurrentHashtag('');
    setIsUploading(false);
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4",
      className
    )}>
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Загрузить Reels</CardTitle>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon name="X" size={20} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Video Upload */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Видео</Label>
              
              {!videoPreview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">
                    Нажмите для выбора видео или перетащите сюда
                  </p>
                  <p className="text-sm text-gray-400">
                    MP4, MOV, AVI до 100 МБ
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={videoPreview}
                    controls
                    className="w-full h-96 object-cover rounded-lg bg-black"
                  />
                  <Button
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Upload Settings */}
            <div className="space-y-6">
              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption">Описание</Label>
                <Textarea
                  id="caption"
                  value={uploadData.caption}
                  onChange={(e) => setUploadData(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Напишите описание к вашему видео..."
                  className="resize-none h-32"
                  maxLength={2200}
                />
                <p className="text-sm text-gray-500">
                  {uploadData.caption?.length || 0}/2200 символов
                </p>
              </div>

              {/* Hashtags */}
              <div className="space-y-2">
                <Label htmlFor="hashtags">Хэштеги</Label>
                <div className="flex gap-2">
                  <Input
                    id="hashtags"
                    value={currentHashtag}
                    onChange={(e) => setCurrentHashtag(e.target.value.replace('#', ''))}
                    placeholder="введите хэштег"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                  />
                  <Button
                    type="button"
                    onClick={handleAddHashtag}
                    disabled={!currentHashtag.trim()}
                  >
                    Добавить
                  </Button>
                </div>
                
                {uploadData.hashtags && uploadData.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uploadData.hashtags.map((hashtag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => handleRemoveHashtag(hashtag)}
                      >
                        {hashtag}
                        <Icon name="X" size={12} className="ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Privacy Settings */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Настройки приватности</Label>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="private">Приватное видео</Label>
                    <p className="text-sm text-gray-500">
                      Только вы сможете видеть это видео
                    </p>
                  </div>
                  <Switch
                    id="private"
                    checked={uploadData.isPrivate}
                    onCheckedChange={(checked) => 
                      setUploadData(prev => ({ ...prev, isPrivate: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="comments">Разрешить комментарии</Label>
                    <p className="text-sm text-gray-500">
                      Пользователи могут оставлять комментарии
                    </p>
                  </div>
                  <Switch
                    id="comments"
                    checked={uploadData.allowComments}
                    onCheckedChange={(checked) => 
                      setUploadData(prev => ({ ...prev, allowComments: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="duet">Разрешить дуэты</Label>
                    <p className="text-sm text-gray-500">
                      Другие пользователи могут создавать дуэты
                    </p>
                  </div>
                  <Switch
                    id="duet"
                    checked={uploadData.allowDuet}
                    onCheckedChange={(checked) => 
                      setUploadData(prev => ({ ...prev, allowDuet: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Загружается...</span>
                <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!videoFile || isUploading}
              className="min-w-24"
            >
              {isUploading ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                'Опубликовать'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadReels;