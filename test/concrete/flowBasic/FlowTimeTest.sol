// SPDX-License-Identifier: CAL
pragma solidity ^0.8.19;

import {Vm} from "forge-std/Test.sol";

import {EvaluableConfigV3} from "rain.interpreter.interface/interface/IInterpreterCallerV2.sol";
import {CloneFactory} from "rain.factory/src/concrete/CloneFactory.sol";
import {FlowBasicTest} from "test/abstract/FlowBasicTest.sol";
import {SignContextLib} from "test/lib/SignContextLib.sol";
import {IFlowV5, ERC20Transfer, ERC721Transfer, ERC1155Transfer} from "src/interface/unstable/IFlowV5.sol";
import {EvaluableV2, SignedContextV1} from "rain.interpreter.interface/interface/IInterpreterCallerV2.sol";
import {InvalidSignature} from "rain.interpreter.interface/lib/caller/LibContext.sol";

import {DEFAULT_STATE_NAMESPACE} from "rain.interpreter.interface/interface/IInterpreterV2.sol";
import {IInterpreterStoreV2} from "rain.interpreter.interface/interface/IInterpreterStoreV2.sol";

contract FlowTimeTest is FlowBasicTest {
    function testFlowBasicFlowTime(uint256[] memory writeToStore) public {
        vm.assume(writeToStore.length != 0);

        (IFlowV5 flow, EvaluableV2 memory evaluable) = deployFlow();

        uint256[] memory stack =
            generateTokenTransferStack(new ERC1155Transfer[](0), new ERC721Transfer[](0), new ERC20Transfer[](0));

        interpreterEval2MockCall(stack, writeToStore);

        vm.mockCall(address(iStore), abi.encodeWithSelector(IInterpreterStoreV2.set.selector), abi.encode());

        vm.expectCall(
            address(iStore),
            abi.encodeWithSelector(IInterpreterStoreV2.set.selector, DEFAULT_STATE_NAMESPACE, writeToStore)
        );

        flow.flow(evaluable, writeToStore, new SignedContextV1[](0));
    }
}
