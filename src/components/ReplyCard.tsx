'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Reply } from '@/types';
import { parseSupabaseDate } from '@/lib/dateUtils';

interface ReplyCardProps {
  reply: Reply;
}

export default function ReplyCard({ reply }: ReplyCardProps) {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.id}`;

  return (
    <div
      className="flex items-start space-x-3 p-3 rounded-lg transition-all"
      style={{ backgroundColor: 'var(--input-bg)' }}
    >
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-7 h-7 rounded-md shrink-0"
        style={{ backgroundColor: 'var(--card-bg)' }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          {reply.is_owner ? (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase inline-flex items-center"
              style={{
                backgroundColor: 'var(--badge-owner-bg)',
                color: 'var(--badge-owner-text)',
              }}
            >
              <FontAwesomeIcon icon={faCrown} className="w-2.5 h-2.5 mr-0.5" />
              Owner
            </span>
          ) : (
            <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
              Anonim
            </span>
          )}
          <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
            {format(parseSupabaseDate(reply.created_at), 'd MMM yyyy, HH:mm', { locale: idLocale })}
          </span>
        </div>
        <p className="text-sm leading-relaxed break-words" style={{ color: 'var(--text-secondary)' }}>
          {reply.reply}
        </p>
      </div>
    </div>
  );
}
