// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {PayrollVault} from "../contracts/PayrollVault.sol";

contract DeployScript is Script {
    function run() external returns (PayrollVault) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdcAddress = vm.envAddress("USDC_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        PayrollVault vault = new PayrollVault(usdcAddress, msg.sender);
        
        vm.stopBroadcast();
        
        return vault;
    }
}
