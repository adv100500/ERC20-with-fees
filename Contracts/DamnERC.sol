

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
/**
 * @title DamnERC
 */
contract DamnERC is ERC20, Ownable {
    using SafeMath for uint256;

    // Maximum amount of tokens
    uint256 public anitWhaleMax;

    // Marketing fee
    uint256 public _marketingFee = 2;

    // Marketing wallet
    address public marketingWallet;

    // Deployer
    address private deployer;

    // Decimals are set to 18 by default in `ERC20`
    constructor(uint256 initialSupply, uint256 _anitWhaleMax, address _marketingWallet) ERC20("DamnERC", "DERC") {
        _mint(msg.sender, initialSupply);
        anitWhaleMax=_anitWhaleMax;
        marketingWallet=_marketingWallet;
        deployer=msg.sender;
    }

    function changeMarketingAddress(address _newAddress) public onlyOwner {
        marketingWallet=_newAddress;
    }

    function changeMarketingFees(uint256 _newFees) public onlyOwner {
        _marketingFee=_newFees;
    }

    function _transfer(address _from, address _to, uint256 _amount) internal virtual override {

        // Deployer and marketing wallet excluded from marketing fees
        if (_from == deployer || _from == marketingWallet) {
            super._transfer(_from, _to, _amount);
        } else {

        // Antiwhale    
        require(_amount <= anitWhaleMax, "antiWhale: Transfer amount exceeds the maxTransferAmount");    

        uint256 marketingAmount=_amount.mul(_marketingFee).div(100);
        uint256 remainingAmount=_amount.sub(marketingAmount);

        // Transfer to marketing wallet
        super._transfer(_from, marketingWallet, marketingAmount);

        // Transfer remaining amount to original receiver
        super._transfer(_from, _to, remainingAmount);
        }
    }
}
