import { useState } from "react";
import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import { keccak256 } from "ethereum-cryptography/keccak"
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils'

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const SIGNATURE_MESSAGE = keccak256(utf8ToBytes("message"));

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function generateSignature(privateKey) {

    const signature = await secp.sign(SIGNATURE_MESSAGE, privateKey, {recovered: true}) 
    console.log(signature)
    signature[0] = toHex(signature[0])
    return signature 
    
   }

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: await generateSignature(privateKey),
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
