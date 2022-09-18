/**
 * @read what we are doing?
 * We are bulding a script that will depoist our token as `Weth` token.
*and export it to `aaveBorrow.js` with the help of `module.exports`.
*
*@read Will call the depoist function on `Weth` contract.
*For that we need `abi` and `contract address` or `interface`(Iweth) OF `Weth`.
*
*@read contract folder
* will make `Contract folder` and have an Interface of  `IWETH.sol` 
*AND In `contract folder` we will make another folder names ` interfaces`.
*
*@read 
*now we have `abi` because of interface(IWeth.sol).
* will have mainnnet `WEth` address- 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
*
*@read 
* now with help of `abi` and `contract address` DEPLOYER will interact with the account.
* With interaction we will call the DEPOSIT  function.

*@read 
*weth interface is similiar to erc20.

*@read FORKING
*Forked blockchain literally take a copy of the mainnet blockchain and simulate it on locally.
*Whatever we do locally on the `forked blockchain` it does not effect mainnet.
*Hardhat forking will give us a couple of fake Accounts.
* Pro: We are forking because its QUICK,EASY,RESEMBLE what's on Mainnet.
*Cons:Always need API, sOME CONTRACTS ARE COMPLEX TO WORK WITH.

*@read HOW FORKING WORKS?
* We can use forking to run our scripts or for tests.
* it doesn't download the entire blockchain.
* Any time we refrence an Address(means there is something in specfic address)
*We make an `API` call to our ethereum Node via ALchemy.
* What API does it -it returns back whatever has in the contract.
*when we have mainnet address for local testing and `api` of alchemy in hardhat
*hardhat gets all the data from mainnet while stimulating it.
*SO `url` in hardhat understand we using mainnet address and need to fetch blokcchain data locally.
* 
* @read 
* get the `abi` and `contract address` and get it connected with deployer 
* and BOOM! connection to the contrcat is established.

 */

const { getNamedAccounts } = require("hardhat")
const AMOUNT = ethers.utils.parseEther("0.02")

async function getWeth() {
    const { deployer } = await getNamedAccounts()

    //THIS IS HOW DEPLOYER INTERACTING WITH A ACCOUNT
    //WITH THE HELP OF `ABI` AND `ADDRESS`.
    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )
    //THIS IS HOW WE ARE CALLING A DEPOSIT FUNCTION.
    const tx = await iWeth.deposit({ value: AMOUNT })
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got${wethBalance.toString()}WETH`)
}

module.exports = { getWeth, AMOUNT }
