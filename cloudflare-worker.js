/**
 * Cloudflare Worker: Reverse Proxy for APIVALE Blog
 * 
 * Target Route on Cloudflare: apivale.com/blog*
 * 
 * This worker intercepts all traffic to apivale.com.
 * If the path starts with /blog, it proxies the request to the hosted Astro blog
 * (e.g., on Vercel or Cloudflare Pages).
 * Otherwise, it passes the traffic through to your VPS origin server.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // ==========================================
    // CONFIGURATION: Replace with your hosted blog domain
    // (e.g., apivale-blog.vercel.app or apivale-blog.pages.dev)
    // ==========================================
    const BLOG_HOST = "apivale-blog.pages.dev"; 

    // Route /blog and /blog/* to the Astro blog host
    if (url.pathname === "/blog" || url.pathname.startsWith("/blog/")) {
      
      const newUrl = new URL(request.url);
      newUrl.hostname = BLOG_HOST;
      
      // Preserve protocol (typically https)
      newUrl.protocol = "https:";
      
      // Create a modified request forwarding headers, method, and body
      const modifiedRequest = new Request(newUrl.toString(), {
        method: request.method,
        headers: new Headers(request.headers),
        body: request.body,
        redirect: 'manual' // Do not auto-follow redirects, pass them back
      });
      
      // Override Host header to prevent Vercel/Pages routing errors
      modifiedRequest.headers.set("Host", BLOG_HOST);

      try {
        const response = await fetch(modifiedRequest);
        return response;
      } catch (error) {
        return new Response("APIVALE Blog Gateway Timeout", { 
          status: 504, 
          headers: { "Content-Type": "text/plain" } 
        });
      }
    }

    // Default: Forward request to the origin server (your VPS)
    return fetch(request);
  }
}
