import { SessionData } from "@/types/interfaces"
import { Context } from "grammy";


export default class Util {
   static randomInteger(min: number, max: number): number {
      return Math.floor(min + Math.random() * (max + 1 - min));
   }

   static initialSession(): SessionData {
      return {
         currentHidden: 0,
         message_ids: [],
      };
   }

   static getSessionKey(ctx: Context): string | undefined {
      return ctx.from?.id.toString();
   }
}