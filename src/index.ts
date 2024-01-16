// src/index.ts
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = fastify();

app.register(require('fastify-cors'), { origin: '*' });

const INSTAGRAM_API_URL = 'https://graph.instagram.com/v12.0';

app.get('/instagram/:username', async (request: FastifyRequest<{ Params: { username: string } }>, reply: FastifyReply) => {
  try {
    const username = request.query;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('Instagram access token not provided.');
    }

    const apiUrl = `${INSTAGRAM_API_URL}/${username}?fields=id,username,account_type,media_count&access_token=${accessToken}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    reply.send(data);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
