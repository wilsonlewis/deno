import { serve } from 'https://deno.land/std@0.155.0/http/server.ts';
import { S3 } from 'https://deno.land/x/s3@0.5.0/mod.ts';

export function startUploadServer(config: {
  accessKeyID: string;
  secretKey: string;
  region: string;
  bucket: string;
}) {
  const bucket = new S3({
    accessKeyID: config.accessKeyID,
    secretKey: config.secretKey,
    region: config.region,
  }).getBucket(config.bucket);

  return serve(async (req) => {
    const headers = new Headers({ 'access-control-allow-origin': '*' });
    const method = req.method.toUpperCase();

    if (method === 'POST') {
      const form = await req.formData();

      const files = form.getAll('file').filter((file): file is File => {
        return file instanceof File;
      });

      const uploads = await Promise.all(files.map(async (file) => {
        const id = crypto.randomUUID();
        const body = new Uint8Array(await file.arrayBuffer());

        await bucket.putObject(id, body, {
          acl: 'public-read',
          contentType: file.type,
        });

        return {
          id,
          type: 'upload',
          name: file.name,
        };
      }));

      return Response.json({
        files: uploads.filter(Boolean),
      }, {
        headers,
      });
    }

    return new Response(null, {
      headers,
    });
  });
}
