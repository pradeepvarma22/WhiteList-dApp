const { ethers } = require("hardhat");


async function main() {

    const WhiteListContract = await ethers.getContractFactory("WhiteList"); //checks in contract folder WhiteList.sol
    const deployWhiteListContract = await WhiteListContract.deploy(10);  //here 10 is the value needed in constructor
    await deployWhiteListContract.deployed();           // wait till it actually gets deployed

    console.log('WhiteList Contract Address-> ', deployWhiteListContract.address);

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
})