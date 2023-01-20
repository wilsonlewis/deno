import { serve } from '@deno/http/server.ts';

const port = Deno.env.get('ENV_PORT');

serve((req) => {
  const upgrade = req.headers.get('upgrade') || '';

  if (upgrade.toLowerCase() != 'websocket') {
    return new Response('request isn\'t trying to upgrade to websocket.');
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    console.log('socket opened');
  };

  socket.onmessage = (e) => {
    console.log('socket message:', e.data);
    socket.send(new Date().toString());
  };

  socket.onerror = (e) => {
    console.log('socket errored:', e);
  };

  socket.onclose = () => {
    console.log('socket closed');
  };

  return response;
}, {
  port: typeof port === 'string' ? Number(port) : undefined,
});
