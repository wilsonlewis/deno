import { serve } from '@deno/http/server.ts';

serve(() => {
  const port = Deno.env.get('ENV_PORT');
  console.log(`Port: ${port}`);
  return Response.json({ message: 'Hello World' });
});
