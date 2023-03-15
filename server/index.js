const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1') 
const { keccak256 } = require("ethereum-cryptography/keccak")
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils')

app.use(cors());
app.use(express.json());

const SIGNATURE_MESSAGE = keccak256(utf8ToBytes("message"));

const balances = {
  "0402fca2f27c418bd92671f65c2a2a1359f0d857734735767c863948240272121a3c390fdf6f44ea1e3949cd54a186b7ff8e192bf2c9a243186c462d077d777ecf": 100,
  "0463bfed2dd9fdc250fbc5999a6a14bdba576a6633c526e06d3f0d4af7d14bf13e97b4dae5b519898b3c74ad831eccf704f322f66c2f4dbe21d98931745aa8eaa9": 50,
  "04a12a939adc3d1e6587af63cc3a843892b362fda4bc24458fc3a1712f156c20b17285364b7a7e833f061e85fac50811724ca073420a648a925581be236ef4b25b": 75,
};

async function recoverPublicKey(message, signature) {

  console.log("Signature 1: ", signature)
  const pubKey = await secp.recoverPublicKey(message, signature[0], signature[1]) 
  console.log(toHex(pubKey))
  return toHex(pubKey)
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  console.log({ balance })
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { recipient, amount, signature } = req.body;

  console.log("Signature 2: ", signature)

  const sender = await recoverPublicKey(SIGNATURE_MESSAGE, signature)

  console.log("Sender: ", sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
