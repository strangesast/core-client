from nginx as proxy
run rm -rf /usr/share/nginx/html/*
copy nginx.conf /etc/nginx/nginx.conf

from node as build
workdir /usr/src/app
copy package*.json ./
run npm install
copy . .
run npm run-script build

from proxy
copy --from=build /usr/src/app/dist/ /usr/share/nginx/html
cmd ["nginx", "-g", "daemon off;"]
