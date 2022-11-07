import 'module-alias/register'
import { config } from 'dotenv'
import { webhookCallback } from 'grammy'
import Fastify from 'fastify'
import { bot } from '@/bot/bot'
import mongoose from 'mongoose'

config();


const fastify = Fastify({ logger: true });
fastify.post('/', webhookCallback(bot, 'fastify'));

async function start() {
   try {
      await fastify.ready();
      await fastify.listen({ port: process.env.PORT || 5000 });
      mongoose.connect(process.env.DB_URL, { dbName: 'quess_number' })
         .then(() => fastify.log.info('Db connected'));
      bot.api.setWebhook(`${process.env.SERVER_URL}`)
         .then(() => fastify.log.info('Bot started'));
   } catch (e) {
      fastify.log.error(e);
      process.exit(1);
   }
}

start();