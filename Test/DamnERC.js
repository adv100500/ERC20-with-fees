const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Damn ERC', function () {
    let deployer, attacker;

    // Initial setup
    const INITIAL_SUPPLY = 1000000n * 10n ** 18n;
    const anitwhaleMax = 10000n * 10n ** 18n;
    const transferTest=100n * 10n ** 18n;
    const marketingTest=2n * 10n ** 18n;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */  
        [deployer, attacker,marketing,anotherGuy] = await ethers.getSigners(); //signers
    
        // Deploy Damn ERC token 
        this.token = await (await ethers.getContractFactory('DamnERC', deployer)).deploy(INITIAL_SUPPLY, anitwhaleMax, marketing.address);
        await this.token.deployed();

        // Check initial supply
        expect(
            await this.token.balanceOf(deployer.address)
        ).to.be.eq(INITIAL_SUPPLY);
     
    });

    it('Antiwhale test', async function () {
        /** Check antiwhale */        
        await expect(
            this.token.connect(deployer).transfer(attacker.address,INITIAL_SUPPLY)
            ).to.be.revertedWith("antiWhale: Transfer amount exceeds the maxTransferAmount");   
    });

    it('Marketing test', async function () {
        //Transfer 100 tokens from deployer to attacker and from attacker to another guy 
        await this.token.connect(deployer).transfer(attacker.address,transferTest);
        await this.token.connect(attacker).transfer(anotherGuy.address,transferTest);

        // Check attacker received 98 tokens
        expect(
            await this.token.balanceOf(anotherGuy.address)
        ).to.be.eq(ethers.utils.parseEther('98'));     
        
        // Check marketing wallet received 2 tokens (2%)
        expect(
            await this.token.balanceOf(marketing.address)
        ).to.be.eq((ethers.utils.parseEther('2')));  
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Deployer didn't transfer to marketing
        expect(
            await this.token.balanceOf(deployer.address)
            ).to.be.eq(ethers.utils.parseEther('999900'));

        // Attacker has 98 tokens         
        expect(
        await this.token.balanceOf(anotherGuy.address)
        ).to.be.eq(ethers.utils.parseEther('98'));
    });
});