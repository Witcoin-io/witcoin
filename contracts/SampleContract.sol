pragma solidity ^0.4.0;


contract SampleContract {

    uint private count;

    function SampleContract(){
        count = 0;
    }

    function increase() {
        count++;
    }

    function add(uint x) {
        count = count + x;
    }

    function getCount() returns(uint){
        return count;
    }

    function sayHello() returns(string){
        return "Hello World!";
    }

    function sayHelloAndIncrease() returns(string){
        count++;
        return "Hello World!";
    }

}
