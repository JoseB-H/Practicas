import { createApp } from './app.mjs';

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3001);
if (!Number.isInteger(port) || port < 0 || port > 65535)
  throw new Error('PORT debe ser un puerto válido.');

const app = createApp();
app.server.on('error', async (error) => {
  console.error('No se pudo iniciar YitVerse:', error.message);
  await app.close();
  process.exitCode = 1;
});
app.server.listen(port, host, () => {
  const address = app.server.address();
  console.log(`YitVerse API lista en http://${host}:${address.port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await app.close();
    process.exitCode = 0;
  });
}
