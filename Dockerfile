FROM nginx:1.27-alpine

# Serve the scroll-craft static site
COPY site /usr/share/nginx/html

# SPA-friendly fallback + gzip + cache headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
