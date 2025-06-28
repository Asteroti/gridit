export default {
  async fetch(request, env, ctx) {
    try {
      console.log('Worker received request:', request.url);
      console.log('Available environment bindings:', Object.keys(env));
      
      // Check if __STATIC_CONTENT binding exists (this is the KV namespace shown in your Cloudflare dashboard)
      if (!env.__STATIC_CONTENT) {
        console.error('__STATIC_CONTENT binding is missing from environment');
        return new Response('__STATIC_CONTENT binding is not available. Please check your Cloudflare configuration.', {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      console.log('__STATIC_CONTENT binding found, attempting to serve request');
      
      // Get the URL pathname
      const url = new URL(request.url);
      let path = url.pathname;
      
      // If path is '/', serve index.html
      if (path === '/' || path === '') {
        path = '/index.html';
      }
      
      // Remove leading slash for KV lookup
      const key = path.replace(/^\//, '');
      
      console.log('Looking up key in KV:', key);
      
      // Try to get the file from KV
      const value = await env.__STATIC_CONTENT.get(key, 'text');
      
      if (value === null) {
        console.error('File not found:', key);
        return new Response('File not found', { status: 404 });
      }
      
      // Determine content type based on file extension
      const contentType = getContentType(key);
      
      return new Response(value, {
        headers: {
          'Content-Type': contentType
        }
      });
    } catch (error) {
      console.error('Worker encountered an error:', error);
      // Return a helpful error message
      return new Response(`Worker error: ${error.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};

// Helper function to determine content type
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