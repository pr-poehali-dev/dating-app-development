import { useState, useRef, useEffect } from 'react';
import { ReelVideo, ReelComment } from '@/types/reels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ReelsCommentsProps {
  reel: ReelVideo;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (text: string) => void;
  className?: string;
}

interface CommentItemProps {
  comment: ReelComment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, text: string) => void;
  level?: number;
}

const CommentItem = ({ comment, onLike, onReply, level = 0 }: CommentItemProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  return (
    <div className={cn("space-y-2", level > 0 && "ml-8 border-l border-gray-700 pl-4")}>
      <div className="flex gap-3">
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">
              {comment.user.name}
            </span>
            {comment.user.isVerified && (
              <Icon name="BadgeCheck" size={14} className="text-blue-400" />
            )}
            <span className="text-gray-400 text-xs">
              {formatDistanceToNow(comment.createdAt, { 
                addSuffix: true, 
                locale: ru 
              })}
            </span>
          </div>
          <p className="text-white text-sm">{comment.text}</p>
          
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-white"
            >
              <Icon 
                name="Heart" 
                size={14} 
                className={comment.isLiked ? "text-red-500 fill-red-500" : ""} 
              />
              {comment.likes.length > 0 && (
                <span className="text-xs">{comment.likes.length}</span>
              )}
            </button>
            
            {level < 2 && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Ответить
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="flex gap-2 mt-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Напишите ответ..."
                className="bg-gray-800 border-gray-700 text-white text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              />
              <Button
                onClick={handleReply}
                size="sm"
                disabled={!replyText.trim()}
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReelsComments = ({
  reel,
  isOpen,
  onClose,
  onAddComment,
  className
}: ReelsCommentsProps) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<ReelComment[]>(reel.comments);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (comment.trim()) {
      const newComment: ReelComment = {
        id: Date.now().toString(),
        userId: 'current-user',
        user: {
          id: 'current-user',
          name: 'Вы',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
        },
        text: comment,
        createdAt: new Date(),
        likes: [],
        replies: []
      };
      
      setComments(prev => [newComment, ...prev]);
      onAddComment(comment);
      setComment('');
    }
  };

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = c.likes.includes('current-user');
        return {
          ...c,
          likes: isLiked 
            ? c.likes.filter(id => id !== 'current-user')
            : [...c.likes, 'current-user'],
          isLiked: !isLiked
        };
      }
      return c;
    }));
  };

  const handleReply = (commentId: string, text: string) => {
    const newReply: ReelComment = {
      id: Date.now().toString(),
      userId: 'current-user',
      user: {
        id: 'current-user',
        name: 'Вы',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      },
      text,
      createdAt: new Date(),
      likes: [],
      replies: []
    };

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-black/80 flex items-end md:items-center md:justify-center",
      className
    )}>
      <div className="bg-gray-900 w-full md:w-96 md:rounded-lg h-[80vh] md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">
            Комментарии ({comments.length})
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Icon name="MessageCircle" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Пока нет комментариев</p>
              <p className="text-sm">Станьте первым, кто оставит комментарий!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={handleLike}
                onReply={handleReply}
              />
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Добавьте комментарий..."
              className="flex-1 bg-gray-800 border-gray-700 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button
              onClick={handleSubmit}
              disabled={!comment.trim()}
              className="px-4"
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsComments;