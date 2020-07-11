from node
workdir /usr/src/app
copy package*.json ./
run npm install
copy . .
run npm run-script build
volume /build
cmd ["cp", "-r", "/usr/src/app/dist/core", "/build/"]
