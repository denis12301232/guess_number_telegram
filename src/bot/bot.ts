import { Bot, session } from 'grammy'
import { config } from 'dotenv'
import Commands from '@/bot/Commands'
import Util from '@/libs/Util'
import { MyContext } from '@/types/interfaces'


config();

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN);
bot.use(session({ getSessionKey: Util.getSessionKey, initial: Util.initialSession }));
bot.api.setMyCommands([
   { command: 'start', description: 'Об игре' },
   { command: 'play', description: 'Играть!' },
   { command: 'stats', description: 'Статистика' }
]);

bot.command('start', Commands.start);
bot.command('play', Commands.play);
bot.command('stats', Commands.stats);
bot.on('message:text', (ctx) => ctx.reply('Это какая-то чушь!'));
Commands.setNumbersCallbacks(bot);
Commands.restart(bot);