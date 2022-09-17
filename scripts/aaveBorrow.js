/**
 *@read
 * aave protocol treats everything is as `ERC20`.
*Warrepd Ethereum (`WETH`) is ethereum in  `ERC20` standards.
*Since We need `weth` so we will make our own `weth` in `getWeth.js` folder.

 */
const { getWeth } = require("../scripts/getWeth")
async function main() {
    await getWeth()
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
