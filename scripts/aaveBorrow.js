/**
 *@read
 * aave protocol treats everything is as `ERC20`.
*Warrepd Ethereum (`WETH`) is ethereum in  `ERC20` standards.
*Since We need `weth` so we will make our own `weth` in `getWeth.js` folder.

*@read MAke a connection with aave Protocol.
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
*it get connected and will have connection with `lending pool`.

*@read 

 */
const { getWeth } = require("../scripts/getWeth")
const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const lendingPool = await getLendingPool(deployer)
    console.log(`lendingPool Address is :${lendingPool.address}`)
}
// ONE
async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        ILendingPoolAddressesProvider,
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

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
