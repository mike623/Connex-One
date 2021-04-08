# Connex one test

## how to start

### for client

1. `cd client`
2. `yarn install`

### for server

1.  `cd server`
2.  `yarn install`

back to project root run
`yarn start`

visit client page via [http://localhost:3000](http://localhost:3000), auth by default

### how to test auth fail case

1. start both client and server
2. visit client page via [http://localhost:3000?auth=false](http://localhost:3000?auth=false)
3. by default

## how to test - server

1.  `cd server`
2.  `yarn test`