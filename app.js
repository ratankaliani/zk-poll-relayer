const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const ethers = require("ethers")
const privPollABI = require("./abi/privpoll1.json")
const path = require('path')
const cors = require('cors')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
// const bodyParser = require('body-parser');

// const api = require('./api.js')

// const server = express()
// server.use('/api', api)
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.type('html').send(html));

app.post("/submitVote", async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      name: "POST endpoint", txHash: "", pollId: -1, success: false, errorMsg: null
    })
  }
  body = req.body
  data = body
  // if ("data" in body == false) {
  //   return res.status(400).json({
  //     name: "No data", txHash: "", pollId: -1, success: false
  //   })
  // }
  // var data = body

  var nullifierHash, vote, proof, pollId

  // Required fields!
  if ("nullifierHash" in data == false) {
    return res.status(400).json({
      name: "Must pass in nullifierHash", txHash: "", pollId: -1, success: false, errorMsg: null
    })
  } else {
    nullifierHash = data.nullifierHash
  }
  if ("proof" in data == false) {
    return res.status(400).json({
      name: "Must pass in a proof", txHash: "", pollId: -1, success: false, errorMsg: null
    })
  } else {
    vote = data.vote
  }
  if ("vote" in data == false) {
    return res.status(400).json({
      name: "Must pass in a vote", txHash: "", pollId: -1, success: false, errorMsg: null
    })
  } else {
    proof = data.proof
  }
  if ("pollId" in data == false) {
    return res.status(400).json({
      name: "Must pass in a poll id", txHash: "", pollId: -1, success: false, errorMsg: null
    })
  } else {
    pollId = data.pollId
  }

  // TODO: REPLACE WITH PRIV_POLL SMART CONTRACT
  const PRIV_POLL_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GOERLI_POLL_CONTRACT
  const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY
  const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL

  if (typeof(GOERLI_PRIVATE_KEY) == 'undefined') {
    throw new Error("GOERLI_PRIVATE_KEY not set")
  }
  if (typeof(PRIV_POLL_CONTRACT_ADDRESS) == 'undefined') {
    throw new Error("PRIV_POLL is not set")

  }

  // Initialize wallet from env private variable
  // Replace with local host endpoint & private key
  const provider = new ethers.providers.JsonRpcProvider(GOERLI_RPC_URL, "goerli");
  const wallet = new ethers.Wallet(GOERLI_PRIVATE_KEY, provider);
  
  // console.log(wallet.address)
  const contract = new ethers.Contract(PRIV_POLL_CONTRACT_ADDRESS, privPollABI, wallet);


  // TODO: REPLACE DUMMY CALL HERE WITH ACTUAL CALL TO VERIFIER CONTRACT
  console.log("Right before cast vote")
  console.log("vote", typeof(vote), vote)
  console.log("nullifier", typeof(nullifierHash), nullifierHash)
  console.log("pollId", typeof(pollId), pollId)
  console.log("proof", typeof(proof), proof)
  var strVote;
  if (vote == 0) {
      strVote =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
  } else {
      strVote =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
  }
  // const tx = await contract.getPollState(pollId)
  const relayer = "0x426bF8b7C4f5CB67eb838CE2585116598cE3019A"
  console.log("Relayer", relayer);
  let receipt;
  try {
      const tx = await contract.castVote(strVote, nullifierHash, pollId.toString(), proof,
          {
          from: relayer,
          gasLimit: '3000000'
          })
      receipt = await tx.wait();
      let txHash = receipt.transactionHash;
      // console.log("What's going on with the txHash?")
      return res.status(200).json({ name: "Voted!", txHash: receipt.transactionHash, pollId: pollId, success: true, errorMsg: null })

  } catch(error) {
      if (error.code === ethers.utils.Logger.errors.CALL_EXCEPTION) {
  
          // The receipt
          console.log(error.receipt);
  
      } else if (error.code === ethers.utils.Logger.errors.TRANSACTION_REPLACED) {
  
          // The receipt of the replacement transaction
          console.log(error.receipt);
  
          // The reason ("repriced", "cancelled" or "replaced")
          console.log(error.reason);
  
          // The transaction that replaced this one
          console.log(error.replacement);
  
      } else {
          // This shouldn't really happen; maybe server error, like the internet connection failed?
      }
      return res.status(200).json({ name: "Failed to vote!", txHash: error.transactionHash, pollId: pollId, success: false, errorMsg: error.code })
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
