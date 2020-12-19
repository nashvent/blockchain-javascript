const fs = require('fs');
const {excecuteAndMonitoringProtocol} = require("./helpers/GeneralHelpers");


const secondsTest = [60, 120, 180];
const nodesTest = [1000, 2000, 3000, 4000, 5000];

const Ripple = require("./protocols/Ripple/Ripple");
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
const Stellar = require("./protocols/Stellar/Stellar");
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



// let begin=Date.now();
// let coin2 = new Ripple(1000);
// coin2.addNewBlock("data1");
// coin2.addNewBlock("data2");
// let end= Date.now();
// let timeSpent=(end-begin)/1000+"secs";




