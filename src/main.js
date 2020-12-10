const Blockchain = require("./protocols/Ripple");

let coin = new Blockchain("000");
coin.addBlock(coin.createBlock("transaction 1"));
coin.addBlock(coin.createBlock("transaction 2"));

console.log(coin.toString());
