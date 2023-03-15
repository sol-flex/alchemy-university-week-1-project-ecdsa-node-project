const secp = require("ethereum-cryptography/secp256k1")
const { keccak256 } = require("ethereum-cryptography/keccak") 
const { toHex, utf8ToBytes, hexToBytes } = require('ethereum-cryptography/utils'
) 
//const privKey = secp.utils.randomPrivateKey();

// console.log("Private Key: ", toHex(privKey))

// // const pubKey = secp.getPublicKey(privKey);

// console.log("Public Key: ", toHex(pubKey))

async function generateSignature(privateKey) {

 const asd = await secp.sign(keccak256(utf8ToBytes("message")), privateKey, {recovered: true}) 
 console.log(asd)
 return asd 
 
}

const signature = generateSignature("92c7e9053a0ab5398e165b070b6fd09be39e39633cf3ca9bcb80ae0f3096ae44")

async function recoverPublicKey(message) {

    const signature = await generateSignature("92c7e9053a0ab5398e165b070b6fd09be39e39633cf3ca9bcb80ae0f3096ae44")
    console.log("Signature: ", signature)
    const pubKey = await secp.recoverPublicKey(message, signature[0], signature[1]) 
    console.log(toHex(pubKey))
    return pubKey
}

recoverPublicKey(keccak256(utf8ToBytes("message")))

