import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const manifest = JSON.parse(manifestJSON);

export default {
  async fetch(request, env, ctx) {
    try {
      console.log('Worker received request:', request.url);
      console.log('Available environment bindings:', Object.keys(env));
      
      if (!env.__STATIC_CONTENT) {
        console.error('__STATIC_CONTENT binding is missing from environment');
        return new Response('__STATIC_CONTENT binding is not available. Please check your Cloudflare configuration.', {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      console.log('__STATIC_CONTENT binding found, attempting to serve request');
      
      const url = new URL(request.url);
      let path = url.pathname;
      
      
      if (path === '/' || path === '') {
        path = '/index.html';
      }
      
      const key = path.replace(/^\//, '');
      
      console.log('Looking up key in manifest:', key);

      const hashedKey = manifest[key];

      if (!hashedKey) {
        console.error('File not found in manifest:', key);
        return new Response('File not found', { status: 404 });
      }

      console.log('Mapped to hashed key:', hashedKey);

      // Try to get the file from KV using the hashed key
      const value = await env.__STATIC_CONTENT.get(hashedKey, 'text');
      
      if (value === null) {
        console.error('File not found:', key);
        return new Response('File not found', { status: 404 });
      }
      
      const contentType = getContentType(key);
      
      return new Response(value, {
        headers: {
          'Content-Type': contentType
        }
      });
    } catch (error) {
      console.error('Worker encountered an error:', error);
      return new Response(`Worker error: ${error.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};

function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html',
    'js': 'application/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon'
  };
  return types[ext] || 'text/plain';
}