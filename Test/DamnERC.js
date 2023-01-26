const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Damn ERC', function () {
    let deployer, attacker, marketing, anotherGuy;

    // Initial setup
    const INITIAL_SUPPLY = 1000000n * 10n ** 18n;
    const anitwhaleMax = 10000n * 10n ** 18n;
    const transferTest=100n * 10n ** 18n;
    const marketingTest=2n * 10n ** 18n;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */  
        [deployer, attacker, marketing, anotherGuy] = await ethers.getSigners(); //signers
    
        // Deploy Damn ERC token 
        this.token = await (await ethers.getContractFactory('DamnERC', deployer)).deploy(INITIAL_SUPPLY, anitwhaleMax, marketing.address);
        await this.token.deployed();

        // Check initial supply
        expect(
            await this.token.balanceOf(deployer.address)
        ).to.be.eq(INITIAL_SUPPLY);
     
    });

    it('Marketing test', async function () {
        //Transfer 100 tokens from deployer to attacker and from attacker to another guy 
        await this.token.connect(deployer).transfer(attacker.address,transferTest);
        await this.token.connect(attacker).transfer(anotherGuy.address,transferTest);

        // Check anotherGuy received 98 tokens (amount without marketing fees)
        expect(
            await this.token.balanceOf(anotherGuy.address)
        ).to.be.eq(ethers.utils.parseEther('98'));     
        
        // Check marketing wallet received 2 tokens (2%)
        expect(
            await this.token.balanceOf(marketing.address)
        ).to.be.eq((ethers.utils.parseEther('2')));  

        // Check deployer didn't transfer to marketing
        expect(
            await this.token.balanceOf(deployer.address)
        ).to.be.eq(ethers.utils.parseEther('999900'));
        
    });


    it('Antiwhale test', async function () {

        // Deployer transfers all tokens to attacker
        await this.token.connect(deployer).transfer(attacker.address,this.token.balanceOf(deployer.address))

        // Check attacker balance 
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.be.eq(ethers.utils.parseEther('999900'));

        // Attacker cannot transfer all tokens to another guy because of antiwhale
        await expect(
            this.token.connect(attacker).transfer(anotherGuy.address,this.token.balanceOf(attacker.address))
            ).to.be.revertedWith("antiWhale: Transfer amount exceeds the maxTransferAmount");   
    });

    it('Change fees and wallet test', async function () {

        // Attacker tries to change marketing address
        await expect(
            this.token.connect(attacker).changeMarketingAddress(attacker.address)
            ).to.be.revertedWith("Ownable: caller is not the owner");   

        // Attacker tries to change marketing fees    
        await expect(
            this.token.connect(attacker).changeMarketingFees(10)
            ).to.be.revertedWith("Ownable: caller is not the owner");   
            
        // Deployer changes marketing address to deployer
        await this.token.connect(deployer).changeMarketingAddress(deployer.address);   
        expect(
            await this.token.marketingWallet()
        ).to.be.eq(deployer.address);          

        // Deployer changes marketing fees to 10%
        await this.token.connect(deployer).changeMarketingFees(10);   
        expect(
            await this.token._marketingFee()
        ).to.be.eq('10');                  
    });    
    
});
