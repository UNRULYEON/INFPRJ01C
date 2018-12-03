# Base image for the server
FROM node:8 as react-build

WORKDIR /app
COPY . ./
RUN npm install
# RUN npm install -g serve
RUN npm run build

# RUN serve -s build

FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]