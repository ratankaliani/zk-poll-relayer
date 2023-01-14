import * as express from 'express'
import {utils, ethers} from 'ethers';
import privPollABI from './abi/privpoll1.json'

const router = express.Router();

router.post('/submitVote', async function(req, res) {
  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

  if (req.method !== 'POST') {
    res.status(405).json({
      name: "POST endpoint", txHash: "", pollId: -1, success: false
    })
  }
  if (typeof req.body == 'string') {
    var body = JSON.parse(req.body)
  } else {
    var body = req.body
  }
  if ("data" in body == false) {
    res.status(400).json({
      name: "No data", txHash: "", pollId: -1, success: false
    })
  }
  var data = body.data

  var nullifierHash, vote, proof, pollId

  // Required fields!
  if ("nullifierHash" in data == false) {
    res.status(400).json({
      name: "Must pass in nullifierHash", txHash: "", pollId: -1, success: false
    })
  } else {
    nullifierHash = data.nullifierHash
  }
  if ("proof" in data == false) {
    res.status(400).json({
      name: "Must pass in a proof", txHash: "", pollId: -1, success: false
    })
  } else {
    vote = data.vote
  }
  if ("vote" in data == false) {
    res.status(400).json({
      name: "Must pass in a vote", txHash: "", pollId: -1, success: false
    })
  } else {
    proof = data.proof
  }
  if ("pollId" in data == false) {
    res.status(400).json({
      name: "Must pass in a poll id", txHash: "", pollId: -1, success: false
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
  try {
      const tx = await contract.castVote(strVote, nullifierHash, pollId.toString(), proof,
          {
          from: relayer,
          gasLimit: '3000000'
          })
      const receipt = await tx.wait();
      return res.status(200).json({ name: "Voted!", txHash: receipt.txHash, pollId: pollId, success: true })


  } catch(error) {
      if (error.code === utils.Logger.errors.CALL_EXCEPTION) {
  
          // The receipt
          console.log(error.receipt);
  
      } else if (error.code === utils.Logger.errors.TRANSACTION_REPLACED) {
  
          // The receipt of the replacement transaction
          console.log(error.receipt);
  
          // The reason ("repriced", "cancelled" or "replaced")
          console.log(error.reason);
  
          // The transaction that replaced this one
          console.log(error.replacement);
  
      } else {
          // This shouldn't really happen; maybe server error, like the internet connection failed?
      }
      return res.status(200).json({ name: "Failed to vote!", txHash: error.txHash, pollId: pollId, success: false })
  }
  
  
});


export default router