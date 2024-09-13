// SPDX-License-Identifier: CAL
pragma solidity =0.8.19;

import {FlowTransferV1, ERC20Transfer, ERC721Transfer, ERC1155Transfer} from "src/interface/unstable/IFlowV5.sol";
import {FlowERC1155Test} from "test/abstract/FlowERC1155Test.sol";
import {
    IFlowERC1155V5, ERC1155SupplyChange, FlowERC1155IOV1
} from "../../../src/interface/unstable/IFlowERC1155V5.sol";

contract FlowPreviewTest is FlowERC1155Test {
    /// Should preview empty flow io
    function testFlowERC1155PreviewEmptyFlowIO(string memory uri, address alice, uint256 amount) public {
        (IFlowERC1155V5 flow,) = deployIFlowERC1155V5({uri: uri});
        assumeEtchable(alice, address(flow));

        ERC1155SupplyChange[] memory mints = new ERC1155SupplyChange[](2);
        mints[0] = ERC1155SupplyChange({account: alice, id: 1, amount: amount});
        mints[1] = ERC1155SupplyChange({account: alice, id: 2, amount: amount});

        ERC1155SupplyChange[] memory burns = new ERC1155SupplyChange[](1);
        burns[0] = ERC1155SupplyChange({account: alice, id: 2, amount: amount});

        FlowERC1155IOV1 memory flowERC1155IO = FlowERC1155IOV1(
            mints, burns, FlowTransferV1(new ERC20Transfer[](0), new ERC721Transfer[](0), new ERC1155Transfer[](0))
        );

        uint256[] memory stack = generateFlowStack(flowERC1155IO);

        assertEq(
            keccak256(abi.encode(flowERC1155IO)),
            keccak256(abi.encode(flow.stackToFlow(stack))),
            "wrong compare Structs"
        );
    }
}