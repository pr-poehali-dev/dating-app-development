import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';

interface CallUser {
  id: string;
  name: string;
  avatar?: string;
}

interface CallState {
  isIncoming: boolean;
  isOutgoing: boolean;
  isConnected: boolean;
  caller?: CallUser;
  recipient?: CallUser;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  callId?: string;
}

interface CallContextType {
  callState: CallState;
  startCall: (recipientId: string, recipientName: string) => Promise<void>;
  answerCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

export const CallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [callState, setCallState] = useState<CallState>({
    isIncoming: false,
    isOutgoing: false,
    isConnected: false,
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Симуляция WebRTC соединения
  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    };

    peerConnection.current = new RTCPeerConnection(configuration);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        // В реальном приложении здесь бы отправлялся ICE candidate через сигналинг сервер
        console.log('ICE candidate:', event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setCallState(prev => ({
          ...prev,
          remoteStream: event.streams[0]
        }));
      }
    };
  };

  const getUserMedia = async (): Promise<MediaStream> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  const startCall = async (recipientId: string, recipientName: string) => {
    try {
      const stream = await getUserMedia();
      
      setCallState({
        isIncoming: false,
        isOutgoing: true,
        isConnected: false,
        recipient: { id: recipientId, name: recipientName },
        localStream: stream,
        callId: Date.now().toString()
      });

      // Симуляция исходящего звонка
      callTimeoutRef.current = setTimeout(() => {
        simulateIncomingCall(recipientId, recipientName);
      }, 2000);

    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const simulateIncomingCall = (callerId: string, callerName: string) => {
    // Симуляция входящего звонка для демонстрации
    if (callState.isOutgoing) {
      // Принимаем звонок автоматически через 3 секунды для демо
      setTimeout(() => {
        setCallState(prev => ({
          ...prev,
          isOutgoing: false,
          isConnected: true
        }));
      }, 3000);
    }
  };

  // Симуляция входящего звонка от другого пользователя
  const receiveIncomingCall = (caller: CallUser) => {
    setCallState({
      isIncoming: true,
      isOutgoing: false,
      isConnected: false,
      caller,
      callId: Date.now().toString()
    });

    // Автоматически отклоняем звонок через 30 секунд
    callTimeoutRef.current = setTimeout(() => {
      rejectCall();
    }, 30000);
  };

  const answerCall = async () => {
    try {
      const stream = await getUserMedia();
      
      setCallState(prev => ({
        ...prev,
        isIncoming: false,
        isConnected: true,
        localStream: stream
      }));

      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }

      // Симуляция успешного соединения
      setTimeout(() => {
        if (remoteVideoRef.current) {
          // Создаем фиктивный поток для демонстрации
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#4299e1';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(callState.caller?.name || 'Собеседник', canvas.width/2, canvas.height/2);
          }
          
          const stream = (canvas as any).captureStream(30);
          remoteVideoRef.current.srcObject = stream;
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to answer call:', error);
      rejectCall();
    }
  };

  const rejectCall = () => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }

    if (callState.localStream) {
      callState.localStream.getTracks().forEach(track => track.stop());
    }

    setCallState({
      isIncoming: false,
      isOutgoing: false,
      isConnected: false,
    });
  };

  const endCall = () => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }

    if (callState.localStream) {
      callState.localStream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setCallState({
      isIncoming: false,
      isOutgoing: false,
      isConnected: false,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  // Симуляция случайных входящих звонков для демонстрации
  useEffect(() => {
    const simulateRandomCall = () => {
      if (!callState.isIncoming && !callState.isOutgoing && !callState.isConnected && user) {
        const callers = [
          { id: '1', name: 'Анна' },
          { id: '2', name: 'Максим' },
          { id: '3', name: 'София' },
          { id: '4', name: 'Елена' },
          { id: '5', name: 'Дмитрий' }
        ];
        
        const randomCaller = callers[Math.floor(Math.random() * callers.length)];
        
        // Случайный входящий звонок с вероятностью
        if (Math.random() < 0.3) {
          receiveIncomingCall(randomCaller);
        }
      }
    };

    const interval = setInterval(simulateRandomCall, 60000); // Каждую минуту проверяем
    return () => clearInterval(interval);
  }, [callState, user]);

  useEffect(() => {
    return () => {
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
      endCall();
    };
  }, []);

  return (
    <CallContext.Provider value={{
      callState,
      startCall,
      answerCall,
      rejectCall,
      endCall,
      localVideoRef,
      remoteVideoRef
    }}>
      {children}
    </CallContext.Provider>
  );
};