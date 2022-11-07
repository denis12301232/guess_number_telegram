import { MyContext } from '@/types/interfaces'

export default class BotApi {
   static readonly numbersInlineKeyboard = {
      inline_keyboard: [
         [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' }],
         [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' }],
         [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' }],
         [{ text: '0', callback_data: '0' }]
      ]
   }

   static readonly restartInlineButton = {
      inline_keyboard: [[{ text: 'Играть заново!', callback_data: 'restart' }]]
   }

   static async deleteMessages(ctx: MyContext, messages: number[]) {
      for (const item of messages) {
         await ctx.api.deleteMessage(ctx?.chat!.id, item)
            .catch(e => console.log(e.message));
      }
      ctx.session.message_ids = [];
   }
}