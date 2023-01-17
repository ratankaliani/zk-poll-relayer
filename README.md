# zkPoll Relayer

This is an example of a Relayer for [zkPoll](https://github.com/daryakaviani/priv-poll). It currently relays transactions for the [zkPoll frontend](https://zkpoll.xyz)

## Deployment

Follow the steps below on [Render](https://onrender.com)

Create a new web service with the following values:
  * Build Command: `yarn`
  * Start Command: `node app.js`
  * ENV variables: GOERLI_RPC_URL, GOERLI_PRIVATE_KEY, NEXT_PUBLIC_GOERLI_POLL_CONTRACT

That's it! Your web service will be live on your Render URL as soon as the build finishes.
