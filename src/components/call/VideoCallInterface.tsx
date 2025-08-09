import { useState, useEffect } from 'react';
import { useCall } from '@/contexts/CallContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function VideoCallInterface() {
  const { callState, endCall, localVideoRef, remoteVideoRef } = useCall();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (callState.isConnected) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setCallDuration(0);
    }
  }, [callState.isConnected]);

  if (!callState.isConnected && !callState.isOutgoing) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (callState.localStream) {
      const audioTrack = callState.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (callState.localStream) {
      const videoTrack = callState.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Заголовок с информацией о звонке */}
      <div className="bg-black bg-opacity-50 text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {callState.isOutgoing && !callState.isConnected 
              ? 'Звоним...' 
              : callState.recipient?.name || callState.caller?.name || 'Видео звонок'
            }
          </h3>
          {callState.isConnected && (
            <p className="text-sm text-gray-300">{formatTime(callDuration)}</p>
          )}
        </div>
      </div>

      {/* Основная область видео */}
      <div className="flex-1 relative">
        {/* Удаленное видео (основное) */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        
        {/* Заглушка если нет удаленного видео */}
        {!callState.remoteStream && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="User" size={64} className="text-white" />
              </div>
              <p className="text-xl">
                {callState.isOutgoing && !callState.isConnected 
                  ? 'Ожидаем ответа...' 
                  : (callState.recipient?.name || callState.caller?.name)
                }
              </p>
            </div>
          </div>
        )}

        {/* Локальное видео (малое окно) */}
        <div className="absolute top-4 right-4 w-32 h-24 bg-black rounded-lg overflow-hidden border-2 border-white">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <Icon name="VideoOff" size={24} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Панель управления */}
      <div className="bg-black bg-opacity-75 p-6">
        <div className="flex justify-center gap-6">
          {/* Выключить/включить микрофон */}
          <Button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <Icon name={isMuted ? "MicOff" : "Mic"} size={24} className="text-white" />
          </Button>

          {/* Завершить звонок */}
          <Button
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600"
          >
            <Icon name="PhoneOff" size={24} className="text-white" />
          </Button>

          {/* Выключить/включить видео */}
          <Button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full ${
              isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <Icon name={isVideoOff ? "VideoOff" : "Video"} size={24} className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}