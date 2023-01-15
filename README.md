# README

This is an example of a Relayer for [zkPoll](zkpoll.xyz).

## Deployment

See https://render.com/docs/deploy-node-express-app or follow the steps below:

Create a new web service with the following values:
  * Build Command: `yarn`
  * Start Command: `node app.js`
  * ENV variables: GOERLI_RPC_URL, GOERLI_PRIVATE_KEY, NEXT_PUBLIC_GOERLI_POLL_CONTRACT

That's it! Your web service will be live on your Render URL as soon as the build finishes.
