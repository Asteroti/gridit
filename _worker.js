export default {
  async fetch(request, env, ctx) {
    try {
      console.log('Worker received request:', request.url);
      console.log('Available environment bindings:', Object.keys(env));
      
      // Check if ASSETS binding exists
      if (!env.ASSETS) {
        console.error('ASSETS binding is missing from environment');
        return new Response('ASSETS binding is not available. Please check your Cloudflare configuration.', {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      console.log('ASSETS binding found, attempting to serve request');
      // Use the ASSETS binding to serve static files
      return env.ASSETS.fetch(request);
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