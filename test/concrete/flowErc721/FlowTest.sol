// SPDX-License-Identifier: CAL
pragma solidity =0.8.19;

import {Vm} from "forge-std/Test.sol";
import {EvaluableV2} from "rain.interpreter.interface/lib/caller/LibEvaluable.sol";
import {REVERTING_MOCK_BYTECODE} from "test/abstract/TestConstants.sol";
import {SignedContextV1} from "rain.interpreter.interface/interface/IInterpreterCallerV2.sol";
import {LibEvaluable} from "rain.interpreter.interface/lib/caller/LibEvaluable.sol";
import {FlowTransferV1, ERC20Transfer, ERC721Transfer, ERC1155Transfer} from "src/interface/unstable/IFlowV5.sol";
import {FlowUtilsAbstractTest} from "test/abstract/FlowUtilsAbstractTest.sol";

import {FlowERC721Test} from "test/abstract/FlowERC721Test.sol";
import {IFlowERC721V5, ERC721SupplyChange, FlowERC721IOV1} from "../../../src/interface/unstable/IFlowERC721V5.sol";
import {SignContextLib} from "test/lib/SignContextLib.sol";
import {IERC20Upgradeable as IERC20} from
    "openzeppelin-contracts-upgradeable/contracts/token/ERC20/IERC20Upgradeable.sol";
import {IERC1155Upgradeable as IERC1155} from
    "openzeppelin-contracts-upgradeable/contracts/token/ERC1155/IERC1155Upgradeable.sol";

contract Erc721FlowTest is FlowERC721Test {
    using LibEvaluable for EvaluableV2;
    using SignContextLib for Vm;

    function testFlowERC721FlowERC20ToERC721(
        uint256 fuzzedKeyAlice,
        uint256 erc20InAmount,
        uint256 erc721OutTokenId,
        string memory flow,
        string memory baseURI
    ) external {
        // Ensure the fuzzed key is within the valid range for secp256k1
        uint256 aliceKey = (fuzzedKeyAlice % (SECP256K1_ORDER - 1)) + 1;
        address alice = vm.addr(aliceKey);

        vm.assume(sentinel != erc20InAmount);
        vm.assume(sentinel != erc721OutTokenId);

        (IFlowERC721V5 erc721Flow, EvaluableV2 memory evaluable) =
            deployFlowERC721({name: flow, symbol: flow, baseURI: baseURI});
        assumeEtchable(alice, address(erc721Flow));

        ERC20Transfer[] memory erc20Transfers = new ERC20Transfer[](1);
        erc20Transfers[0] =
            ERC20Transfer({token: address(iTokenA), from: alice, to: address(erc721Flow), amount: erc20InAmount});

        ERC721Transfer[] memory erc721Transfers = new ERC721Transfer[](1);
        erc721Transfers[0] =
            ERC721Transfer({token: iTokenB, from: address(erc721Flow), to: alice, id: erc721OutTokenId});

        vm.mockCall(iTokenA, abi.encodeWithSelector(IERC20.transferFrom.selector), abi.encode(true));
        vm.expectCall(iTokenA, abi.encodeWithSelector(IERC20.transferFrom.selector, alice, erc721Flow, erc20InAmount));

        vm.mockCall(iTokenB, abi.encodeWithSelector(bytes4(keccak256("safeTransferFrom(address,address,uint256)"))), "");
        vm.expectCall(
            iTokenB,
            abi.encodeWithSelector(
                bytes4(keccak256("safeTransferFrom(address,address,uint256)")), erc721Flow, alice, erc721OutTokenId
            )
        );

        uint256[] memory stack = generateFlowStack(
            FlowERC721IOV1(
                new ERC721SupplyChange[](0),
                new ERC721SupplyChange[](0),
                FlowTransferV1(erc20Transfers, erc721Transfers, new ERC1155Transfer[](0))
            )
        );
        interpreterEval2MockCall(stack, new uint256[](0));

        vm.startPrank(alice);
        erc721Flow.flow(evaluable, new uint256[](0), new SignedContextV1[](0));
        vm.stopPrank();
    }

    function testFlowERC721lowERC1155ToERC1155(
        address alice,
        uint256 erc1155OutTokenId,
        uint256 erc1155OutAmmount,
        uint256 erc1155BInTokenId,
        uint256 erc1155BInAmmount,
        string memory name,
        string memory symbol,
        string memory baseURI
    ) external {
        vm.assume(sentinel != erc1155OutTokenId);
        vm.assume(sentinel != erc1155OutAmmount);
        vm.assume(sentinel != erc1155BInTokenId);
        vm.assume(sentinel != erc1155BInAmmount);

        (IFlowERC721V5 erc721Flow, EvaluableV2 memory evaluable) =
            deployFlowERC721({name: name, symbol: symbol, baseURI: baseURI});
        assumeEtchable(alice, address(erc721Flow));

        ERC1155Transfer[] memory erc1155Transfers = new ERC1155Transfer[](2);
        erc1155Transfers[0] = ERC1155Transfer({
            token: address(iTokenA),
            from: address(erc721Flow),
            to: alice,
            id: erc1155OutTokenId,
            amount: erc1155OutAmmount
        });

        erc1155Transfers[1] = ERC1155Transfer({
            token: address(iTokenB),
            from: alice,
            to: address(erc721Flow),
            id: erc1155BInTokenId,
            amount: erc1155BInAmmount
        });

        vm.mockCall(iTokenA, abi.encodeWithSelector(IERC1155.safeTransferFrom.selector), "");
        vm.expectCall(
            iTokenA,
            abi.encodeWithSelector(
                IERC1155.safeTransferFrom.selector, erc721Flow, alice, erc1155OutTokenId, erc1155OutAmmount, ""
            )
        );

        vm.mockCall(iTokenB, abi.encodeWithSelector(IERC1155.safeTransferFrom.selector), "");
        vm.expectCall(
            iTokenB,
            abi.encodeWithSelector(
                IERC1155.safeTransferFrom.selector, alice, erc721Flow, erc1155BInTokenId, erc1155BInAmmount, ""
            )
        );

        uint256[] memory stack = generateFlowStack(
            FlowERC721IOV1(
                new ERC721SupplyChange[](0),
                new ERC721SupplyChange[](0),
                FlowTransferV1(new ERC20Transfer[](0), new ERC721Transfer[](0), erc1155Transfers)
            )
        );
        interpreterEval2MockCall(stack, new uint256[](0));

        vm.startPrank(alice);
        erc721Flow.flow(evaluable, new uint256[](0), new SignedContextV1[](0));
        vm.stopPrank();
    }

    function testFlowERC721lowERC20ToERC20(
        uint256 erc20OutAmmount,
        uint256 erc20BInAmmount,
        uint256 fuzzedKeyAlice,
        string memory name,
        string memory symbol,
        string memory baseURI
    ) external {
        vm.assume(sentinel != erc20OutAmmount);
        vm.assume(sentinel != erc20BInAmmount);

        // Ensure the fuzzed key is within the valid range for secp256k1
        uint256 aliceKey = (fuzzedKeyAlice % (SECP256K1_ORDER - 1)) + 1;
        address alice = vm.addr(aliceKey);

        (IFlowERC721V5 erc721Flow, EvaluableV2 memory evaluable) =
            deployFlowERC721({name: name, symbol: symbol, baseURI: baseURI});
        assumeEtchable(alice, address(erc721Flow));

        ERC20Transfer[] memory erc20Transfers = new ERC20Transfer[](2);
        erc20Transfers[0] =
            ERC20Transfer({token: address(iTokenA), from: address(erc721Flow), to: alice, amount: erc20OutAmmount});
        erc20Transfers[1] =
            ERC20Transfer({token: address(iTokenB), from: alice, to: address(erc721Flow), amount: erc20BInAmmount});

        vm.startPrank(alice);

        vm.mockCall(address(iTokenA), abi.encodeWithSelector(IERC20.transfer.selector), abi.encode(true));
        vm.expectCall(address(iTokenA), abi.encodeWithSelector(IERC20.transfer.selector, alice, erc20OutAmmount));

        vm.mockCall(address(iTokenB), abi.encodeWithSelector(IERC20.transferFrom.selector), abi.encode(true));
        vm.expectCall(
            address(iTokenB), abi.encodeWithSelector(IERC20.transferFrom.selector, alice, erc721Flow, erc20BInAmmount)
        );

        uint256[] memory stack = generateFlowStack(
            FlowERC721IOV1(
                new ERC721SupplyChange[](0),
                new ERC721SupplyChange[](0),
                FlowTransferV1(erc20Transfers, new ERC721Transfer[](0), new ERC1155Transfer[](0))
            )
        );

        interpreterEval2MockCall(stack, new uint256[](0));

        SignedContextV1[] memory signedContexts1 = new SignedContextV1[](2);
        signedContexts1[0] = vm.signContext(aliceKey, aliceKey, new uint256[](0));
        signedContexts1[1] = vm.signContext(aliceKey, aliceKey, new uint256[](0));

        erc721Flow.flow(evaluable, new uint256[](0), signedContexts1);
        vm.stopPrank();
    }

    function testFlowERC721FlowERC721ToERC721(
        uint256 fuzzedKeyAlice,
        uint256 erc721OutTokenId,
        uint256 erc721BInTokenId,
        string memory name,
        string memory symbol,
        string memory baseURI
    ) external {
        // Ensure the fuzzed key is within the valid range for secp256k1
        uint256 aliceKey = (fuzzedKeyAlice % (SECP256K1_ORDER - 1)) + 1;
        address alice = vm.addr(aliceKey);

        vm.assume(sentinel != erc721OutTokenId);
        vm.assume(sentinel != erc721BInTokenId);

        (IFlowERC721V5 erc721Flow, EvaluableV2 memory evaluable) =
            deployFlowERC721({name: name, symbol: symbol, baseURI: baseURI});
        assumeEtchable(alice, address(erc721Flow));

        ERC721Transfer[] memory erc721Transfers = new ERC721Transfer[](2);
        erc721Transfers[0] =
            ERC721Transfer({token: address(iTokenA), from: address(erc721Flow), to: alice, id: erc721OutTokenId});
        erc721Transfers[1] =
            ERC721Transfer({token: address(iTokenB), from: alice, to: address(erc721Flow), id: erc721BInTokenId});

        vm.mockCall(iTokenA, abi.encodeWithSelector(bytes4(keccak256("safeTransferFrom(address,address,uint256)"))), "");
        vm.expectCall(
            iTokenA,
            abi.encodeWithSelector(
                bytes4(keccak256("safeTransferFrom(address,address,uint256)")), erc721Flow, alice, erc721OutTokenId
            )
        );

        vm.mockCall(iTokenB, abi.encodeWithSelector(bytes4(keccak256("safeTransferFrom(address,address,uint256)"))), "");
        vm.expectCall(
            iTokenB,
            abi.encodeWithSelector(
                bytes4(keccak256("safeTransferFrom(address,address,uint256)")), alice, erc721Flow, erc721BInTokenId
            )
        );

        uint256[] memory stack = generateFlowStack(
            FlowERC721IOV1(
                new ERC721SupplyChange[](0),
                new ERC721SupplyChange[](0),
                FlowTransferV1(new ERC20Transfer[](0), erc721Transfers, new ERC1155Transfer[](0))
            )
        );

        interpreterEval2MockCall(stack, new uint256[](0));

        vm.startPrank(alice);
        erc721Flow.flow(evaluable, new uint256[](0), new SignedContextV1[](0));
        vm.stopPrank();
    }
}
