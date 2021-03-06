const fs = require('fs');
const Stellar = require("./protocols/Stellar/Stellar");
const Ripple = require("./protocols/Ripple/Ripple");
const {excecuteAndMonitoringProtocol} = require("./helpers/GeneralHelpers");
const testData = [
    {
        to: "001",
        from: "004",
        value: 20,
    },
    {
        to: "004",
        from: "002",
        value: 18,
    },
    {
        to: "002",
        from: "003",
        value: 26,
    }
]
let coin = new Ripple(1000);
for(let data of testData){
    coin.addNewBlock(JSON.stringify(data));
}
console.log(coin.toString());


//  Test config
/*
const secondsTest = [60, 120, 180];
const nodesTest = [1000, 2000, 3000, 4000, 5000];

console.log("############################");
console.log("Ripple Test");
console.log("############################");


const rippleResult = {};
for(let second of secondsTest){
    console.log("+ seconds", second);
    rippleResult[second.toString()] = {};
    for(let nodesSize of nodesTest ){
        console.log("- nodesSize", nodesSize);
        rippleResult[second.toString()][nodesSize.toString()] = excecuteAndMonitoringProtocol(Ripple, nodesSize, second); 
        console.log(rippleResult[second.toString()][nodesSize.toString()]);
    }
}

fs.writeFileSync('results/ripple_result_minutes.json', JSON.stringify(rippleResult));
console.log("############################");
console.log("Stellar Test");
console.log("############################");

const stellarResult = {};

for(let second of secondsTest){
    console.log("+ seconds", second);
    stellarResult[second.toString()] = {};
    for(let nodesSize of nodesTest ){
        console.log("- nodesSize", nodesSize);
        stellarResult[second.toString()][nodesSize.toString()] = excecuteAndMonitoringProtocol(Stellar, nodesSize, second);
        console.log(stellarResult[second.toString()][nodesSize.toString()]);
    }
}

fs.writeFileSync('results/stellar_result_minuts.json', JSON.stringify(stellarResult));
*/




