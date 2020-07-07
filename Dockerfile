from node as build
workdir /usr/src/app
copy package*.json ./
run npm install
copy . .
run npm run-script build

from nginx
copy nginx.conf /etc/nginx/nginx.conf
run rm -rf /usr/share/nginx/html/*
copy --from=build /usr/src/app/dist/ /usr/share/nginx/html
cmd ["nginx", "-g", "daemon off;"]
