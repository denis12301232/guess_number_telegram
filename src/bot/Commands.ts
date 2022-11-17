import { CommandContext, Bot } from 'grammy'
import { MyContext } from '@/types/interfaces'
import StatModel from '@/models/Stat'
import UserModel from '@/models/User'
import Util from '@/libs/Util'
import BotApi from '@/bot/BotApi'


export default class Commands {
   static async start(ctx: CommandContext<MyContext>) {
      try {
         const { first_name, last_name, username } = ctx.msg.from!;
         const user = await UserModel.findOne({ chatId: ctx.from?.id }).lean();

         if (!user) {
            const newUser = await UserModel.create({ chatId: ctx.from?.id, name: first_name, lastname: last_name, username });
            await StatModel.create({ user: newUser._id });
         } else {
            await UserModel.updateOne({ chatId: ctx.from?.id }, { $set: { name: first_name, lastname: last_name, username } });
         }
         return ctx.api.sendMessage(ctx.chat.id,
            `Игра "<b>Угадай число</b>":\nВ этой игре вам предстоит проверить свою удачу! Для начала игры введите команду /play!`,
            { parse_mode: 'HTML' });
      } catch (e) {
         if (e instanceof Error) console.log(e.message);
         return ctx.reply('Упс... Произошла ошибка!');
      }
   }

   static async play(ctx: CommandContext<MyContext>) {
      try {
         await BotApi.deleteMessages(ctx, ctx.session.message_ids);
         const msg1 = await ctx.reply('Начинаем игру! Я загадываю число от 0 до 9, угадай его!');
         const randomNumber = Util.randomInteger(0, 9);
         ctx.session.currentHidden = randomNumber;
         const msg2 = await ctx.reply('Итак, выбирай число!', { reply_markup: BotApi.numbersInlineKeyboard });
         return ctx.session.message_ids = [...ctx.session.message_ids, msg1.message_id, msg2.message_id];
      } catch (e) {
         if (e instanceof Error) console.log(e.message);
         return ctx.reply('Упс... Произошла ошибка!');
      }
   }

   static async stats(ctx: CommandContext<MyContext>) {
      try {
         const user = await UserModel.findOne({ chatId: ctx.from?.id }).lean();
         const stats = await StatModel.findOne({ user: user?._id }).lean();
         return ctx.reply(`Статистика:\nВерно отгадано: ${stats?.rightAnswers}\nНе верно: ${stats?.wrongAnswers}\nОтгадно ${stats?.percent.toFixed(0)}% чисел!`);
      } catch (e) {
         if (e instanceof Error) console.log(e.message);
         return ctx.reply('Упс... Произошла ошибка!');
      }
   }

   static setNumbersCallbacks(bot: Bot<MyContext>) {
      for (let i = 0; i <= 9; i++) {
         bot.callbackQuery(`${i}`, async (ctx) => {
            try {
               await ctx.editMessageReplyMarkup();
               await ctx.reply(`Выбрано число ${i}.`);
               const user = await UserModel.findOne({ chatId: ctx.from.id }).lean();
               const stat = await StatModel.findOne({ user: user?._id });
               stat!.total += 1;
               if (i === ctx.session.currentHidden) {
                  stat!.rightAnswers += 1;
                  await ctx.reply(`Это верный ответ! 🏆`, {
                     reply_markup: BotApi.restartInlineButton
                  });
               } else {
                  stat!.wrongAnswers += 1;
                  await ctx.reply(`Увы, это не то число. Было загадано: ${ctx.session.currentHidden}!`, {
                     reply_markup: BotApi.restartInlineButton
                  });
               }
               stat!.percent = stat!.rightAnswers / stat!.total * 100;
               return stat?.save();
            } catch (e) {
               if (e instanceof Error) console.log(e.message);
               return ctx.reply('Упс... Произошла ошибка!');
            }
         });
      }
   }

   static restart(bot: Bot<MyContext>) {
      bot.callbackQuery('restart', async (ctx) => {
         try {
            await BotApi.deleteMessages(ctx, ctx.session.message_ids);
            await ctx.editMessageReplyMarkup();
            const randomNumber = Util.randomInteger(0, 9);
            ctx.session.currentHidden = randomNumber;
            const msg1 = await ctx.reply('Итак, выбирай число!', { reply_markup: BotApi.numbersInlineKeyboard });
            return ctx.session.message_ids.push(msg1.message_id);
         } catch (e) {
            if (e instanceof Error) console.log(e.message);
            return ctx.reply('Упс... Произошла ошибка!');
         }
      });
   }
}