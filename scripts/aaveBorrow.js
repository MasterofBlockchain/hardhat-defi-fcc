/**
 *@read
 * aave protocol treats everything is as `ERC20`.
*Warrepd Ethereum (`WETH`) is ethereum in  `ERC20` standards.
*Since We need `weth` so we will make our own `weth` in `getWeth.js` folder.

*@read We need `weth` to deposit in `aave` hence we have changed our `erc20` to `weth20` in
* `getEth` folder and have imported it here. now we have `WETH` and we need a connection between `aave`.

*@whatWeDoing
*We have `weth`
*now we want to deposit it.before we deposit we need to have `ledingAddressProvider` and connect it with deployer.
* now we fetch `lendingpool` outta `ledingAddressProvider`.
* as we see in `lendingPool` there are using `IERC20safeTransfer` to have money in the aave protocol.
*we make `approveerc20` function and get it approve.
* and we have money in `ApproveERC20` and deposit it in `lending pool`.
* before we `borrow` we need to have a conversion price of`dai` tokens(from Chainlink). it because
*we have colletral in `eth` and based on `eth` pric we need conversion to know what amount of `dai` we
*could borrow.
*now we have `dai` and could figure how much `dai` we want to borrow.
*once borrow is done.
we want to `repay`
*for repaying there is again `erc20` approve standarad there.

*
* 

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
*@read FOUR

*getUserAccountData()
* it will get us the details of total coletaral, how much we have borrowed, 
*and how muchw e can borrow, healthcheckup
* LIQUIDAATION THRESHOLD: 
*lets say we have `1eth` as colletaral and its `loanToValue` is : 77% in `dai` token
*and `thershold` is : `80%`. it means we have maxiuim take `77%` loan outta `1eth` and if loan amount
*corsoss over threshold which is `80%` we will get liquidated.
*In `threshold` people will buy your `colletral` while paying for your assest and but it for cheap.
*so `aave` protocol incetiwise users for liqudating other users.
*so it make sures there is no more borrow than colletarales.
*so `aave ` protocol does it it with a function called ` healthFactor` if its below `1` you get liquidated.
*`liquadation Call()` is the function we use to liquidate users.



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
    console.log("Deposited!")
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
        lendingPool,
        deployer
    )
    //https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/2704
    const daiPrice = await getDaiPrice()
    // we are converting `eth` price to `dai` price
    const amountDaiToBorrow =
        availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber())
    console.log(`You could borrow ${amountDaiToBorrow} DAI`)
    const amountDaiToBorrowWei = ethers.utils.parseEther(
        amountDaiToBorrow.toString()
    )
    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    await borrowDai(
        daiTokenAddress,
        lendingPool,
        amountDaiToBorrowWei,
        deployer
    )
    await getBorrowUserData(lendingPool, deployer)
    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
    await getBorrowUserData(lendingPool, deployer) //repeating the same line so could print out
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveERC20(daiAddress, lendingPool.address, amount, account) //we have approve in erc20 stylt to approve
    const repayTx = await lendingPool.repay(daiAddress, amount, 1, account)
    await repayTx.wait(1)
    console.log("Repaid!")
}
async function borrowDai(
    daiAddress,
    lendingPool,
    amountDaiToBorrowWei,
    account
) {
    const borrowTx = await lendingPool.borrow(
        daiAddress,
        amountDaiToBorrowWei,
        1,
        0,
        account
    )
    await borrowTx.wait(1)
    console.log("You've Borrowed!")
}
//five
// we dont need `deployer` account here. because just are reading and not creating transaction.
//`latestRoundData` function of `AggregatorV3Interface` returns a couple of things. but we want
//`price` which is at index [1].
async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    )
    //we are wrapping it to have just `1` index of `latestRoundData`
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`The Dai/Eth price is ${price.toString()}`)
    return price
}
//BoRROW (four)
//how much we have borrowed,how much we have in Colleteral,how much we can borrow
async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)
    console.log(`You have total worth of ${totalCollateralETH} deposited`)
    console.log(`You have ${totalDebtETH} worth of eth borrowed`)
    console.log(`you can borrow  ${availableBorrowsETH} worth of eth.`)
    return { availableBorrowsETH, totalDebtETH }
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
