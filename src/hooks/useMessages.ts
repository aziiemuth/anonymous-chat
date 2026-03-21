'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Message, Reply } from '@/types';

let cachedMessages: Message[] | null = null;
let cachedReplies: Record<string, Reply[]> | null = null;

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(cachedMessages || []);
  const [replies, setReplies] = useState<Record<string, Reply[]>>(cachedReplies || {});
  const [loading, setLoading] = useState(!cachedMessages);

  // Fetch initial data
  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client is not initialized. Check your environment variables.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      
      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
      } else {
        const fetchedMsg = messagesData || [];
        cachedMessages = fetchedMsg;
        setMessages(fetchedMsg);
      }

      // Fetch replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('replies')
        .select('*')
        .order('created_at', { ascending: true });

      if (repliesError) {
        console.error('Error fetching replies:', repliesError);
      } else {
        const repliesByMessageId: Record<string, Reply[]> = {};
        repliesData?.forEach((reply: Reply) => {
          if (!repliesByMessageId[reply.message_id]) {
            repliesByMessageId[reply.message_id] = [];
          }
          repliesByMessageId[reply.message_id].push(reply);
        });
        cachedReplies = repliesByMessageId;
        setReplies(repliesByMessageId);
      }

      setLoading(false);
    };

    fetchData();

    // Subscribe to realtime updates
    const messageChannel = supabase
      .channel('messages-all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => {
              const next = [payload.new as Message, ...prev];
              cachedMessages = next;
              return next;
            });
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => {
              const next = prev.filter((m) => m.id !== payload.old.id);
              cachedMessages = next;
              return next;
            });
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? (payload.new as Message) : m))
            );
          }
        }
      )
      .subscribe();

    const replyChannel = supabase
      .channel('replies-all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'replies' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const newReply = payload.new as Reply;
            setReplies((prev) => ({
              ...prev,
              [newReply.message_id]: [...(prev[newReply.message_id] || []), newReply],
            }));
          } else if (payload.eventType === 'DELETE') {
            const oldReplyId = payload.old.id;
            // Since Supabase DELETE payload often only has the ID, 
            // we find which message this reply belongs to by searching current state
            setReplies((prev) => {
              const next = { ...prev };
              for (const [msgId, msgReplies] of Object.entries(next)) {
                if (msgReplies.some(r => r.id === oldReplyId)) {
                  next[msgId] = msgReplies.filter(r => r.id !== oldReplyId);
                  break;
                }
              }
              return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(replyChannel);
    };
  }, []);

  const addReply = async (messageId: any, content: string, isOwner: boolean = false) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('replies')
      .insert([
        {
          message_id: messageId,
          reply: content,
          is_owner: isOwner,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const toggleLove = async (id: any, currentStatus: boolean) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('messages')
      .update({ is_loved: !currentStatus })
      .eq('id', id);
    if (error) throw error;
  };

  const togglePin = async (id: any, currentStatus: boolean) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('messages')
      .update({ is_pinned: !currentStatus })
      .eq('id', id);
    if (error) throw error;
  };

  return { messages, replies, loading, addReply, toggleLove, togglePin };
}
