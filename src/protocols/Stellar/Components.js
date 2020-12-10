// Quorum slices
class QuorumSlices {
    constructor(threshold, validators, innerSets) {
        this.threshold = threshold; // limit for convert in Quorum
        this.validators = validators; // [node, node, node]
        this.innerSets = innerSets; // [a, b, [c, d], [e,[f,g,h], i]] 
    }
}

class NominateMessage{
    constructor(voted, accepted){
        this.voted = voted; // X
        this.accepted = accepted; // Y
    }
}

class Ballot{
    constructor(counter, value){
        this.counter = counter; // n
        this.value = value; // x
    }

    isMoreSignificantThat(ballot){
        if(this.counter === ballot.counter){
            return this.value > ballot.value;
        }
        return this.counter > ballot.counter; 
    }
}