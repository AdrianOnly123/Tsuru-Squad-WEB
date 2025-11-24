# frontend/Dockerfile
FROM nginx:alpine

# Copiamos los archivos estáticos al directorio que sirve Nginx
COPY . /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]