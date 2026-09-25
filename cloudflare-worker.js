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
    // NATIVE 301 PERMANENT REDIRECTS (EDGE LEVEL)
    // ==========================================
    const PERMANENT_REDIRECTS = {
      "/blog/cursor-pro-vs-own-api-key": "/blog/cursor-pro-vs-custom-api-key/",
      "/blog/cursor-pro-vs-own-api-key/": "/blog/cursor-pro-vs-custom-api-key/",
      "/cursor-pro-vs-own-api-key": "/blog/cursor-pro-vs-custom-api-key/",
      "/cursor-pro-vs-own-api-key/": "/blog/cursor-pro-vs-custom-api-key/",
      "/blog/cursor-pro-vs-byok-cost-comparison": "/blog/cursor-pro-vs-custom-api-key/",
      "/blog/cursor-pro-vs-byok-cost-comparison/": "/blog/cursor-pro-vs-custom-api-key/",
      "/cursor-pro-vs-byok-cost-comparison": "/blog/cursor-pro-vs-custom-api-key/",
      "/cursor-pro-vs-byok-cost-comparison/": "/blog/cursor-pro-vs-custom-api-key/",
      "/blog/connect-glm-5-3-to-claude-code-cli": "/blog/connect-glm-5-3-to-claude-code-cli-cursor/",
      "/blog/connect-glm-5-3-to-claude-code-cli/": "/blog/connect-glm-5-3-to-claude-code-cli-cursor/",
      "/blog/how-to-connect-glm-5-3-to-claude-code-cli-cursor": "/blog/connect-glm-5-3-to-claude-code-cli-cursor/",
      "/blog/how-to-connect-glm-5-3-to-claude-code-cli-cursor/": "/blog/connect-glm-5-3-to-claude-code-cli-cursor/",
      "/blog/gpt-6-sol-vs-deepseek-v4-migration-guide": "/blog/gpt-6-sol-vs-deepseek-v4/",
      "/blog/gpt-6-sol-vs-deepseek-v4-migration-guide/": "/blog/gpt-6-sol-vs-deepseek-v4/",
      "/gpt-6-sol-vs-deepseek-v4-migration-guide": "/blog/gpt-6-sol-vs-deepseek-v4/",
      "/gpt-6-sol-vs-deepseek-v4-migration-guide/": "/blog/gpt-6-sol-vs-deepseek-v4/"
    };

    if (PERMANENT_REDIRECTS[url.pathname]) {
      const redirectTarget = new URL(PERMANENT_REDIRECTS[url.pathname], `https://${url.hostname}`).href;
      return Response.redirect(redirectTarget, 301);
    }
    
    // ==========================================
    // EDGE-LEVEL TRAILING SLASH 301 ENFORCEMENT
    // Consolidate non-slash URLs to slash URLs (e.g., /blog/qwen-3-8... -> /blog/qwen-3-8.../)
    // ==========================================
    if (url.pathname === "/blog") {
      const redirectTarget = new URL("/blog/" + url.search, `https://${url.hostname}`).href;
      return Response.redirect(redirectTarget, 301);
    }

    if (url.pathname.startsWith("/blog/") && !url.pathname.endsWith("/")) {
      // Exclude static assets with file extensions (e.g., .png, .jpg, .svg, .css, .js, .xml, .txt, .webp, .ico)
      if (!/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
        const redirectTarget = new URL(url.pathname + "/" + url.search, `https://${url.hostname}`).href;
        return Response.redirect(redirectTarget, 301);
      }
    }
    
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
