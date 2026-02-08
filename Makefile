.PHONY: install test build deploy clean

install:
	npm install
	forge install OpenZeppelin/openzeppelin-contracts --no-commit

test:
	forge test

build:
	npm run build
	forge build

deploy:
	forge script scripts/Deploy.s.sol --broadcast --rpc-url $(NEXT_PUBLIC_ARC_RPC_URL)

clean:
	forge clean
	rm -rf node_modules .next out
