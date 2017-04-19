# About
Interactive application that allows for display tweets in a scatter plot with various aggregation and selection methods.

# Requirements
### Redis
  - Windows https://github.com/rgl/redis/downloads
  - Linux/OSX http://redis.io/topics/quickstart

### Node
  - Windows https://github.com/coreybutler/nvm-windows
  - Linux/OSX https://github.com/creationix/nvm

# Usage
### Starting up
1. `npm i`
2. `npm run redis`
4. `npm start`
5. Open browser at `localhost:8080`

### Pulling Results
The command `npm run dump` will output logs into `log/data.json`

### Cleaning DB
To clean the DB you need to restart the application that was ran using `npm run server` then you need flush redis which you can do using `npm run flush`
