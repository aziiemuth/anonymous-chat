export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Message {
  id: any;
  message: string;
  is_pinned: boolean;
  is_highlighted: boolean;
  is_loved: boolean;
  created_at: string;
}

export interface Reply {
  id: any;
  message_id: any;
  parent_reply_id: any | null;
  reply: string;
  is_owner: boolean;
  created_at: string;
  user_id?: any | null;
}

export interface Reaction {
  id: string;
  message_id: string;
  emoji: string;
  count: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'owner' | 'user';
  created_at: string;
}
