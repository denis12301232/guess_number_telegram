import { SessionData } from "@/types/interfaces"

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
}