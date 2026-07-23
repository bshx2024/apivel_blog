/**
 * Cloudflare Worker: Reverse Proxy for APIVALE Blog
 * 
 * Target Route on Cloudflare: apivale.com/blog*
 * 
 * This worker intercepts all traffic to apivale.com.
 * If the path starts with /blog or /_astro, it proxies the request to the hosted Astro blog
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

    // Route /blog, /blog/*, and /_astro/* to the Astro blog host
    if (url.pathname === "/blog" || url.pathname.startsWith("/blog/") || url.pathname.startsWith("/_astro/")) {
      
      const newUrl = new URL(request.url);
      newUrl.hostname = BLOG_HOST;
      newUrl.protocol = "https:";
      
      // 去除 /blog 前缀以匹配 Pages 部署在根目录的文件结构
      if (newUrl.pathname === "/blog") {
        newUrl.pathname = "/";
      } else if (newUrl.pathname.startsWith("/blog/")) {
        newUrl.pathname = newUrl.pathname.substring(5); // 去除 "/blog"
      }
      
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

        // 重写 301/308 重定向中的 Location 响应头，确保自动补全 /blog 前缀，防止浏览器跳出博客子路径
        if (response.status >= 300 && response.status < 400 && response.headers.has("Location")) {
          const originalLocation = response.headers.get("Location");
          let newLocation = originalLocation;

          if (newLocation.startsWith("/") && !newLocation.startsWith("/blog/")) {
            newLocation = "/blog" + newLocation;
          } else if (newLocation.startsWith(`https://${BLOG_HOST}`)) {
            newLocation = newLocation.replace(`https://${BLOG_HOST}`, `https://${url.hostname}/blog`);
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
