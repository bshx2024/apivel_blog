/**
 * Cloudflare Worker: Reverse Proxy for APIVALE Blog
 * 
 * Target Route on Cloudflare: apivale.com/blog*
 * 
 * This worker intercepts all traffic to apivale.com/blog*.
 * It proxies requests to the hosted Astro blog on Cloudflare Pages (dist/blog/*).
 * Otherwise, it passes traffic through to your VPS origin server.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // ==========================================
    // CONFIGURATION: Replace with your hosted blog domain
    // (e.g., apivale-blog.pages.dev)
    // ==========================================
    const BLOG_HOST = "apivale-blog.pages.dev"; 

    // Route /blog and /blog/* to the Astro blog host
    if (url.pathname === "/blog" || url.pathname.startsWith("/blog/")) {
      
      const newUrl = new URL(request.url);
      newUrl.hostname = BLOG_HOST;
      newUrl.protocol = "https:";
      
      // Ensure /blog has a trailing slash for index route matching
      if (newUrl.pathname === "/blog") {
        newUrl.pathname = "/blog/";
      }
      
      // Forward request preserving the /blog/ path structure in dist/blog/
      const modifiedRequest = new Request(newUrl.toString(), {
        method: request.method,
        headers: new Headers(request.headers),
        body: request.body,
        redirect: 'manual' // Do not auto-follow redirects, pass them back
      });
      
      // Override Host header to match Pages host
      modifiedRequest.headers.set("Host", BLOG_HOST);

      try {
        const response = await fetch(modifiedRequest);

        // 重写 301/308 重定向中的 Location 响应头，确保保留 /blog 前缀
        if (response.status >= 300 && response.status < 400 && response.headers.has("Location")) {
          const originalLocation = response.headers.get("Location");
          let newLocation = originalLocation;

          if (newLocation.startsWith("/") && !newLocation.startsWith("/blog/")) {
            newLocation = "/blog" + newLocation;
          } else if (newLocation.startsWith(`https://${BLOG_HOST}`)) {
            newLocation = newLocation.replace(`https://${BLOG_HOST}`, `https://${url.hostname}`);
            if (!newLocation.includes("/blog/")) {
              newLocation = newLocation.replace(url.hostname, `${url.hostname}/blog`);
            }
          }

          const newHeaders = new Headers(response.headers);
          newHeaders.set("Location", newLocation);

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        }

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
