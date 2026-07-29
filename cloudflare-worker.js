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
      
      // Strip /blog prefix for Pages target host (dist is deployed at root /)
      newUrl.pathname = newUrl.pathname.replace(/^\/blog/, "") || "/";
      
      // Ensure directory routes have a trailing slash for Astro index route matching
      if (!newUrl.pathname.endsWith("/") && !/\.[a-zA-Z0-9]+$/.test(newUrl.pathname)) {
        newUrl.pathname = newUrl.pathname + "/";
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

        // Rewrite Location header in 301/308 redirects to always preserve /blog/ prefix
        if (response.status >= 300 && response.status < 400 && response.headers.has("Location")) {
          let location = response.headers.get("Location") || "";
          
          if (!location.startsWith("http://") && !location.startsWith("https://")) {
            if (!location.startsWith("/")) location = "/" + location;
            if (!location.startsWith("/blog/")) {
              location = "/blog" + location;
            }
          } else {
            location = location.replace(`https://${BLOG_HOST}`, `https://${url.hostname}`);
            if (!location.includes("/blog/")) {
              location = location.replace(`${url.hostname}/`, `${url.hostname}/blog/`);
            }
          }

          const newHeaders = new Headers(response.headers);
          newHeaders.set("Location", location);

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
