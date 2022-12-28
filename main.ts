import { serve } from '@deno/http/server.ts';

serve(() => {
  return Response.json({ message: 'Hello World' });
});
