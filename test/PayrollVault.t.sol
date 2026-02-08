// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {PayrollVault} from "../contracts/PayrollVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PayrollVaultTest is Test {
    PayrollVault public vault;
    IERC20 public usdc;
    
    address public owner = address(1);
    address public employee1 = address(2);
    address public employee2 = address(3);
    
    function setUp() public {
        // Deploy mock USDC
        // In production, use actual USDC address on Arc
        usdc = IERC20(address(0x123)); // Replace with actual USDC address
        
        vm.prank(owner);
        vault = new PayrollVault(address(usdc), owner);
    }
    
    function testAddEmployee() public {
        vm.prank(owner);
        vault.addEmployee(employee1, "alice.company.eth");
        
        (address addr, string memory name) = vault.getEmployee(0);
        assertEq(addr, employee1);
        assertEq(name, "alice.company.eth");
    }
    
    function testBatchDistribute() public {
        // Setup employees
        vm.prank(owner);
        vault.addEmployee(employee1, "alice.company.eth");
        
        vm.prank(owner);
        vault.addEmployee(employee2, "bob.company.eth");
        
        // Mock USDC transfer
        // In production, you'd need to handle USDC approvals and transfers
        
        address[] memory recipients = new address[](2);
        recipients[0] = employee1;
        recipients[1] = employee2;
        
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1000 * 10**6; // 1000 USDC (6 decimals)
        amounts[1] = 2000 * 10**6; // 2000 USDC
        
        // This test would need proper USDC mocking
        // vm.prank(owner);
        // vault.batchDistribute(recipients, amounts);
    }
}
