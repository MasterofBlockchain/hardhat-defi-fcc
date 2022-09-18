/**
 *@read
 * aave protocol treats everything is as `ERC20`.
*Warrepd Ethereum (`WETH`) is ethereum in  `ERC20` standards.
*Since We need `weth` so we will make our own `weth` in `getWeth.js` folder.

*@read We need `weth` to deposit in `aave` hence we have changed our `erc20` to `weth20` in
* `getEth` folder and have imported it here. now we have `WETH` and we need a connection between `aave`.

*@read Make a connection with aave Protocol.
*the way aave works is it has a `contract` which will point us to the right `contract`.
* we need `abi` and `contract address` to get connected with deployer.
*In `aave` there is a contract named `lendingPoolAddressProvider` which has all the `addresses` of aave protocol.
*so we will have `interafce` of `lendingPoolAddressProvider` for `abi` 
*and have mainnet address of it :0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5.

*@read one (mentioned down)
*this function will help us to get the address of `lending pool` outta `lendingPoolAddressProvider`.
*so we need `interface` of ``lendingPoolAddressProvider`` for the function `getlendingPool`.
*We are connecting `deployer` with the `abi` and `contract of `lendingPoolAddressProvider`. 
*then try to fetch address of `lending pool`Now we have the address of `lending pool`
* and will have `abi` while have interface contract of `ILendingpool`and with help of deployer
*it get connected and will have connection with `lending pool`.and cosnole us the `address` of `lendingpool`.

*@read TWO(mentioned below)
*Now we have lendingPool address and can depsit money but in `deposit` function of `aavelendingPool`
*its using `IERC2O` method to get the money in the contract of aave(lendingpool).
*so we will have intefface of `IERC2O` AND @Read THREE
*
*@read THREE
*will have `abi`(IERC20) and `contract address(ERC20)` 
*now deployer get connected with `interface` and will call `approve` function.
*
*

 */
const { getWeth, AMOUNT } = require("../scripts/getWeth")
const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const lendingPool = await getLendingPool(deployer)
    console.log(`lendingPool Address is :${lendingPool.address}`)

    //(two)deposit
    const WethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    //approve
    await approveERC20(WethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log("Depositing!")
    await lendingPool.deposit(WethTokenAddress, AMOUNT, deployer, 0)
    console.log("DEposited!")
}
// ONE
//`getlendingpool` is a function of : lendingPoolAddressProvider
async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )

    const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddress,
        account
    )
    return lendingPool
}
//three
async function approveERC20(
    erc20Address,
    spenderAddress,
    amountToSpend,
    account
) {
    const erc20Token = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        account
    )
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
