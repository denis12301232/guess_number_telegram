import { Context, SessionFlavor } from 'grammy';

export interface SessionData {
      currentHidden: number;
      message_ids: number[];
}

export type MyContext = Context & SessionFlavor<SessionData>;