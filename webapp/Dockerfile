FROM quay.io/jeffdean/node-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM quay.io/jeffdean/nginx-unprivileged
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf