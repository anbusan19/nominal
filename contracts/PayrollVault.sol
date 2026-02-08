// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PayrollVault
 * @notice Manages corporate payroll treasury and batch distribution to employees
 */
contract PayrollVault is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    
    struct Employee {
        address employeeAddress;
        string ensSubname;
        bool active;
    }

    mapping(address => Employee) public employees;
    address[] public employeeList;
    
    event EmployeeAdded(address indexed employee, string ensSubname);
    event EmployeeRemoved(address indexed employee);
    event PayrollDistributed(address indexed recipient, uint256 amount);
    event Deposit(address indexed depositor, uint256 amount);

    constructor(address _usdc, address _initialOwner) Ownable(_initialOwner) {
        usdc = IERC20(_usdc);
    }

    /**
     * @notice Deposit USDC into the vault
     * @param amount Amount of USDC to deposit
     */
    function deposit(uint256 amount) external {
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount);
    }

    /**
     * @notice Add an employee to the payroll system
     * @param employeeAddress The employee's wallet address
     * @param ensSubname The employee's ENS subname (e.g., "alice.company.eth")
     */
    function addEmployee(address employeeAddress, string memory ensSubname) external onlyOwner {
        require(employeeAddress != address(0), "Invalid address");
        require(!employees[employeeAddress].active, "Employee already exists");
        
        employees[employeeAddress] = Employee({
            employeeAddress: employeeAddress,
            ensSubname: ensSubname,
            active: true
        });
        
        employeeList.push(employeeAddress);
        emit EmployeeAdded(employeeAddress, ensSubname);
    }

    /**
     * @notice Remove an employee from the payroll system
     * @param employeeAddress The employee's wallet address to remove
     */
    function removeEmployee(address employeeAddress) external onlyOwner {
        require(employees[employeeAddress].active, "Employee does not exist");
        employees[employeeAddress].active = false;
        emit EmployeeRemoved(employeeAddress);
    }

    /**
     * @notice Batch distribute payroll to multiple employees
     * @param recipients Array of employee addresses
     * @param amounts Array of USDC amounts (in wei, 6 decimals for USDC)
     */
    function batchDistribute(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(employees[recipients[i]].active, "Employee not active");
            require(amounts[i] > 0, "Amount must be greater than 0");
            
            usdc.safeTransfer(recipients[i], amounts[i]);
            emit PayrollDistributed(recipients[i], amounts[i]);
        }
    }

    /**
     * @notice Get the current USDC balance of the vault
     */
    function balance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    /**
     * @notice Get the total number of employees
     */
    function getEmployeeCount() external view returns (uint256) {
        return employeeList.length;
    }

    /**
     * @notice Get employee information by index
     */
    function getEmployee(uint256 index) external view returns (address, string memory) {
        require(index < employeeList.length, "Index out of bounds");
        Employee memory emp = employees[employeeList[index]];
        return (emp.employeeAddress, emp.ensSubname);
    }
}
