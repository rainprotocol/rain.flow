// SPDX-License-Identifier: CAL
pragma solidity =0.8.19;

import {FlowTransferV1, ERC20Transfer, ERC721Transfer, ERC1155Transfer} from "src/interface/unstable/IFlowV5.sol";
import {FlowERC721Test} from "test/abstract/FlowERC721Test.sol";
import {IFlowERC721V5, ERC721SupplyChange, FlowERC721IOV1} from "../../../src/interface/unstable/IFlowERC721V5.sol";

contract FlowPreviewTest is FlowERC721Test {
    /**
     * @dev Tests the preview of defined Flow IO for ERC1155
     *      using multi-element arrays.
     */
    function testFlowERC721PreviewDefinedFlowIOForERC1155MultiElementArrays(
        address alice,
        uint256 erc1155Amount,
        uint256 erc1155TokenId
    ) external {
        flowPreviewDefinedFlowIOForERC1155MultiElementArrays(alice, erc1155Amount, erc1155TokenId);
    }

    /**
     * @dev Tests the preview of defined Flow IO for ERC721
     *      using multi-element arrays.
     */
    function testFlowERC721PreviewDefinedFlowIOForERC721MultiElementArrays(
        address alice,
        uint256 erc721TokenIdA,
        uint256 erc721TokenIdB
    ) external {
        flowPreviewDefinedFlowIOForERC721MultiElementArrays(alice, erc721TokenIdA, erc721TokenIdB);
    }

    /**
     * @dev Tests the preview of defined Flow IO for ERC20
     *      using multi-element arrays.
     */
    function testFlowERC721PreviewDefinedFlowIOForERC20MultiElementArrays(
        address alice,
        uint256 erc20AmountA,
        uint256 erc20AmountB
    ) external {
        flowPreviewDefinedFlowIOForERC20MultiElementArrays(alice, erc20AmountA, erc20AmountB);
    }

    /**
     * @dev Tests the preview of defined Flow IO for ERC1155
     *      using single-element arrays.
     */
    function testFlowERC721PreviewDefinedFlowIOForERC1155SingleElementArrays(
        address alice,
        uint256 erc1155Amount,
        uint256 erc1155TokenId
    ) external {
        flowPreviewDefinedFlowIOForERC1155SingleElementArrays(alice, erc1155Amount, erc1155TokenId);
    }

    /**
     * @dev Tests the preview of defined Flow IO for ERC721
     *      using single-element arrays.
     */
    function testFlowERC721PreviewDefinedFlowIOForERC721SingleElementArrays(
        string memory symbol,
        string memory baseURI,
        address alice,
        uint256 erc721TokenInId,
        uint256 erc721TokenOutId
    ) external {
        vm.assume(sentinel != erc721TokenInId);
        vm.assume(sentinel != erc721TokenOutId);

        vm.label(alice, "alice");

        (IFlowERC721V5 flow,) = deployFlowERC721({name: symbol, symbol: symbol, baseURI: baseURI});
        assumeEtchable(alice, address(flow));

        ERC721Transfer[] memory erc721Transfers = new ERC721Transfer[](2);
        erc721Transfers[0] = ERC721Transfer({token: iTokenA, from: address(flow), to: alice, id: erc721TokenOutId});
        erc721Transfers[1] = ERC721Transfer({token: iTokenA, from: alice, to: address(flow), id: erc721TokenInId});

        ERC721SupplyChange[] memory mints = new ERC721SupplyChange[](2);
        mints[0] = ERC721SupplyChange({account: alice, id: 1});
        mints[1] = ERC721SupplyChange({account: alice, id: 2});

        ERC721SupplyChange[] memory burns = new ERC721SupplyChange[](1);
        burns[0] = ERC721SupplyChange({account: alice, id: 2});

        FlowERC721IOV1 memory flowERC721IO = FlowERC721IOV1(
            mints, burns, FlowTransferV1(new ERC20Transfer[](0), erc721Transfers, new ERC1155Transfer[](0))
        );

        uint256[] memory stack = generateFlowStack(flowERC721IO);

        assertEq(
            keccak256(abi.encode(flowERC721IO)), keccak256(abi.encode(flow.stackToFlow(stack))), "wrong compare Structs"
        );
    }

    /**
     * @dev Tests the preview of defined Flow IO for ERC20
     *      using single-element arrays.
     */
    function testFlowERC721PreviewDefinedFlowIOForERC20SingleElementArrays(
        string memory symbol,
        string memory baseURI,
        address alice,
        uint256 erc20AmountIn,
        uint256 erc20AmountOut
    ) external {
        vm.assume(sentinel != erc20AmountIn);
        vm.assume(sentinel != erc20AmountOut);

        vm.label(alice, "alice");

        (IFlowERC721V5 flow,) = deployFlowERC721({name: symbol, symbol: symbol, baseURI: baseURI});
        assumeEtchable(alice, address(flow));

        ERC20Transfer[] memory erc20Transfers = new ERC20Transfer[](2);
        erc20Transfers[0] =
            ERC20Transfer({token: address(iTokenA), from: address(flow), to: alice, amount: erc20AmountOut});
        erc20Transfers[1] =
            ERC20Transfer({token: address(iTokenA), from: alice, to: address(flow), amount: erc20AmountIn});

        ERC721SupplyChange[] memory mints = new ERC721SupplyChange[](2);
        mints[0] = ERC721SupplyChange({account: alice, id: 1});
        mints[1] = ERC721SupplyChange({account: alice, id: 2});

        ERC721SupplyChange[] memory burns = new ERC721SupplyChange[](1);
        burns[0] = ERC721SupplyChange({account: alice, id: 2});

        FlowERC721IOV1 memory flowERC721IO = FlowERC721IOV1(
            mints, burns, FlowTransferV1(erc20Transfers, new ERC721Transfer[](0), new ERC1155Transfer[](0))
        );

        uint256[] memory stack = generateFlowStack(flowERC721IO);

        assertEq(
            keccak256(abi.encode(flowERC721IO)), keccak256(abi.encode(flow.stackToFlow(stack))), "wrong compare Structs"
        );
    }

    /**
     * @dev Tests the preview of an empty Flow IO.
     */
    function testFlowERC721PreviewEmptyFlowIO(string memory symbol, string memory baseURI, address alice) public {
        (IFlowERC721V5 flow,) = deployFlowERC721({name: symbol, symbol: symbol, baseURI: baseURI});
        assumeEtchable(alice, address(flow));

        ERC721SupplyChange[] memory mints = new ERC721SupplyChange[](2);
        mints[0] = ERC721SupplyChange({account: alice, id: 1});
        mints[1] = ERC721SupplyChange({account: alice, id: 2});

        ERC721SupplyChange[] memory burns = new ERC721SupplyChange[](1);
        burns[0] = ERC721SupplyChange({account: alice, id: 2});

        FlowERC721IOV1 memory flowERC721IO = FlowERC721IOV1(
            mints, burns, FlowTransferV1(new ERC20Transfer[](0), new ERC721Transfer[](0), new ERC1155Transfer[](0))
        );

        uint256[] memory stack = generateFlowStack(flowERC721IO);

        assertEq(
            keccak256(abi.encode(flowERC721IO)), keccak256(abi.encode(flow.stackToFlow(stack))), "wrong compare Structs"
        );
    }
}
