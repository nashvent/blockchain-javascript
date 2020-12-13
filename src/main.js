const Stellar = require("./protocols/Stellar/Stellar");

// let coin = new Stellar(1000);
// coin.addNewBlock("data1");
// coin.addNewBlock("data2");
// console.log(coin.toString());

const Ripple = require("./protocols/Ripple/Ripple");

let coin2 = new Ripple(1000);
coin2.addNewBlock("data1");
coin2.addNewBlock("data2");
console.log(coin2.toString());