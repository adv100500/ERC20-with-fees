# ERC20-with-fees
ERC20 with fees and anti-whale

**Constructor:**
https://github.com/adv100500/ERC20-with-fees/blob/375494db1e0ef02909774baf7fbd1ac240068a6b/Contracts/DamnERC.sol#L32-L36
*Inputs* 
- initialSupply = total supply of tokens
- _anitWhaleMax = maximum amount of tokens for one transfer and for the balance of any address except excluded from anti-whale cap
- _marketingWallet = address of wallet with fees
- Deployer, _marketingWallet and token addresses are excluded from anti-whale cap

**Function to change wallet address with fees**
https://github.com/adv100500/ERC20-with-fees/blob/375494db1e0ef02909774baf7fbd1ac240068a6b/Contracts/DamnERC.sol#L45-L49

**Function to change fees amount**
https://github.com/adv100500/ERC20-with-fees/blob/375494db1e0ef02909774baf7fbd1ac240068a6b/Contracts/DamnERC.sol#L51-L53

**Function to add / remove addresses from antiwhale cap**
https://github.com/adv100500/ERC20-with-fees/blob/375494db1e0ef02909774baf7fbd1ac240068a6b/Contracts/DamnERC.sol#L56-L59

**Function to set ON / OFF anti-whale cap on the total balance of tokens of any address except excluded from anti-whale cap**
https://github.com/adv100500/ERC20-with-fees/blob/375494db1e0ef02909774baf7fbd1ac240068a6b/Contracts/DamnERC.sol#L67-L69
This function will be set ON once the liquidity pool is created. The liquidity pool address will be then excluded from anti-whale cap via the previous function.
Deployer and wallet with fees are always excluded from antiwhale cap because of the following:
https://github.com/adv100500/ERC20-with-fees/blob/375494db1e0ef02909774baf7fbd1ac240068a6b/Contracts/DamnERC.sol#L75-L77
For all other addresses, anti-whale cap will be applied:
https://github.com/adv100500/ERC20-with-fees/blob/375494db1e0ef02909774baf7fbd1ac240068a6b/Contracts/DamnERC.sol#L91-L95


![image](https://user-images.githubusercontent.com/121932525/215260172-8ee8e2da-c3ca-433e-afb1-be64d72258d3.png)


