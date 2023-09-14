import { ethers, artifacts } from "hardhat";
import { RainterpreterExpressionDeployerNP } from "../typechain";
import {
  RainterpreterExpressionDeployerConstructionConfigStruct,
} from "../typechain/RainterpreterExpressionDeployerNP";

export const deployExpressionDeployer = async (): Promise<RainterpreterExpressionDeployerNP> => {
  const interpreter = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const store = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
  
  const bytes_ =
    "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000029000000000000000000000000000000000000000000000000000000000000052000000000000000000000000000000000000000000000000000000000000005e000000000000000000000000000000000000000000000000000000000000006a000000000000000000000000000000000000000000000000000000000000007a00000000000000000000000000000000000000000000000000000000000000860000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000009a00000000000000000000000000000000000000000000000000000000000000a600000000000000000000000000000000000000000000000000000000000000b400000000000000000000000000000000000000000000000000000000000000be00000000000000000000000000000000000000000000000000000000000000cc00000000000000000000000000000000000000000000000000000000000000e600000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000000001060000000000000000000000000000000000000000000000000000000000000114000000000000000000000000000000000000000000000000000000000000012200000000000000000000000000000000000000000000000000000000000001300000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000014c000000000000000000000000000000000000000000000000000000000000015800000000000000000000000000000000000000000000000000000000000001660000000000000000000000000000000000000000000000000000000000000178000000000000000000000000000000000000000000000000000000000000018a00000000000000000000000000000000000000000000000000000000000001a400000000000000000000000000000000000000000000000000000000000001c200000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000001f000000000000000000000000000000000000000000000000000000000000002020000000000000000000000000000000000000000000000000000000000000212000000000000000000000000000000000000000000000000000000000000022400000000000000000000000000000000000000000000000000000000000002320000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000024e000000000000000000000000000000000000000000000000000000000000025c000000000000000000000000000000000000000000000000000000000000026c000000000000000000000000000000000000000000000000000000000000027e000000000000000000000000000000000000000000000000000000000000028e00000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002ae00000000000000000000000000000000000000000000000000000000000002be00000000000000000000000000000000000000000000000000000000000002e20737461636b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000028436f7069657320616e206578697374696e672076616c75652066726f6d2074686520737461636b2e000000000000000000000000000000000000000000000000636f6e7374616e74000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000027436f70696573206120636f6e7374616e742076616c7565206f6e746f2074686520737461636b2e00000000000000000000000000000000000000000000000000636f6e7465787400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000067436f7069657320612076616c75652066726f6d2074686520636f6e746578742e20546865206669727374206f706572616e642069732074686520636f6e7465787420636f6c756d6e20616e64207365636f6e642069732074686520636f6e7465787420726f772e00000000000000000000000000000000000000000000000000686173680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000003e48617368657320616c6c20696e7075747320696e746f20612073696e676c6520333220627974652076616c7565207573696e67206b656363616b3235362e0000626c6f636b2d6e756d62657200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000195468652063757272656e7420626c6f636b206e756d6265722e00000000000000636861696e2d69640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000155468652063757272656e7420636861696e2069642e00000000000000000000006d61782d696e742d76616c75650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000003b546865206d6178696d756d20706f737369626c65206e6f6e2d6e6567617469766520696e74656765722076616c75652e20325e323536202d20312e00000000006d61782d646563696d616c31382d76616c756500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000043546865206d6178696d756d20706f737369626c6520313820646563696d616c20666978656420706f696e742076616c75652e20726f7567686c7920312e31356537372e0000000000000000000000000000000000000000000000000000000000626c6f636b2d74696d657374616d70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001c5468652063757272656e7420626c6f636b2074696d657374616d702e00000000616e790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000045546865206669727374206e6f6e2d7a65726f2076616c7565206f7574206f6620616c6c20696e707574732c206f72203020696620657665727920696e70757420697320302e000000000000000000000000000000000000000000000000000000636f6e646974696f6e730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000010154726561747320696e7075747320617320706169727769736520636f6e646974696f6e2f76616c75652070616972732e20546865206669727374206e6f6e7a65726f20636f6e646974696f6e27732076616c756520697320757365642e204966206e6f20636f6e646974696f6e7320617265206e6f6e7a65726f2c207468652065787072657373696f6e20726576657274732e20546865206f706572616e642063616e206265207573656420617320616e206572726f7220636f646520746f20646966666572656e7469617465206265747765656e206d756c7469706c6520636f6e646974696f6e7320696e207468652073616d652065787072657373696f6e2e00000000000000000000000000000000000000000000000000000000000000656e7375726500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000bf5265766572747320696620616e7920696e70757420697320302e20416c6c20696e70757473206172652065616765726c79206576616c756174656420746865726520617265206e6f206f7574707574732e20546865206f706572616e642063616e206265207573656420617320616e206572726f7220636f646520746f20646966666572656e7469617465206265747765656e206d756c7469706c6520636f6e646974696f6e7320696e207468652073616d652065787072657373696f6e2e00657175616c2d746f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000273120696620616c6c20696e707574732061726520657175616c2c2030206f74686572776973652e000000000000000000000000000000000000000000000000006576657279000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000041546865206c617374206e6f6e7a65726f2076616c7565206f7574206f6620616c6c20696e707574732c206f72203020696620616e7920696e70757420697320302e00000000000000000000000000000000000000000000000000000000000000677265617465722d7468616e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000043312069662074686520666972737420696e7075742069732067726561746572207468616e20746865207365636f6e6420696e7075742c2030206f74686572776973652e0000000000000000000000000000000000000000000000000000000000677265617465722d7468616e2d6f722d657175616c2d746f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000004f312069662074686520666972737420696e7075742069732067726561746572207468616e206f7220657175616c20746f20746865207365636f6e6420696e7075742c2030206f74686572776973652e0000000000000000000000000000000000696600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000007549662074686520666972737420696e707574206973206e6f6e7a65726f2c20746865207365636f6e6420696e70757420697320757365642e204f74686572776973652c2074686520746869726420696e70757420697320757365642e2049662069732065616765726c79206576616c75617465642e000000000000000000000069732d7a65726f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000021312069662074686520696e70757420697320302c2030206f74686572776973652e000000000000000000000000000000000000000000000000000000000000006c6573732d7468616e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000040312069662074686520666972737420696e707574206973206c657373207468616e20746865207365636f6e6420696e7075742c2030206f74686572776973652e6c6573732d7468616e2d6f722d657175616c2d746f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000004c312069662074686520666972737420696e707574206973206c657373207468616e206f7220657175616c20746f20746865207365636f6e6420696e7075742c2030206f74686572776973652e0000000000000000000000000000000000000000646563696d616c31382d64697600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000082446976696465732074686520666972737420696e70757420627920616c6c206f7468657220696e7075747320617320666978656420706f696e7420313820646563696d616c206e756d626572732028692e652e20276f6e65272069732031653138292e204572726f727320696620616e792064697669736f72206973207a65726f2e000000000000000000000000000000000000000000000000000000000000646563696d616c31382d6d756c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a04d756c7469706c69657320616c6c20696e7075747320746f67657468657220617320666978656420706f696e7420313820646563696d616c206e756d626572732028692e652e20276f6e65272069732031653138292e204572726f727320696620746865206d756c7469706c69636174696f6e206578636565647320746865206d6178696d756d2076616c75652028726f7567686c7920312e3135653737292e646563696d616c31382d7363616c6531382d64796e616d6963000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001015363616c657320612076616c75652066726f6d20736f6d6520666978656420706f696e7420646563696d616c207363616c6520746f20313820646563696d616c20666978656420706f696e742e2054686520666972737420696e70757420697320746865207363616c6520746f207363616c652066726f6d20616e6420746865207365636f6e64206973207468652076616c756520746f207363616c652e205468652074776f206f7074696f6e616c206f706572616e647320636f6e74726f6c20726f756e64696e6720616e642073617475726174696f6e20726573706563746976656c79206173207065722060646563696d616c31382d7363616c653138602e00000000000000000000000000000000000000000000000000000000000000646563696d616c31382d7363616c65313800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000015d5363616c657320616e20696e7075742076616c75652066726f6d20736f6d6520666978656420706f696e7420646563696d616c207363616c6520746f20313820646563696d616c20666978656420706f696e742e20546865206669727374206f706572616e6420697320746865207363616c6520746f207363616c652066726f6d2e20546865207365636f6e6420286f7074696f6e616c29206f706572616e6420636f6e74726f6c7320726f756e64696e672077686572652030202864656661756c742920726f756e647320646f776e20616e64203120726f756e64732075702e2054686520746869726420286f7074696f6e616c29206f706572616e6420636f6e74726f6c732073617475726174696f6e2077686572652030202864656661756c7429206572726f7273206f6e206f766572666c6f7720616e64203120736174757261746573206174206d61782d646563696d616c2d76616c75652e000000646563696d616c31382d7363616c652d6e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000015b5363616c657320616e20696e7075742076616c75652066726f6d20313820646563696d616c20666978656420706f696e7420746f20736f6d65206f7468657220666978656420706f696e74207363616c65204e2e20546865206669727374206f706572616e6420697320746865207363616c6520746f207363616c6520746f2e20546865207365636f6e6420286f7074696f6e616c29206f706572616e6420636f6e74726f6c7320726f756e64696e672077686572652030202864656661756c742920726f756e647320646f776e20616e64203120726f756e64732075702e2054686520746869726420286f7074696f6e616c29206f706572616e6420636f6e74726f6c732073617475726174696f6e2077686572652030202864656661756c7429206572726f7273206f6e206f766572666c6f7720616e64203120736174757261746573206174206d61782d646563696d616c2d76616c75652e0000000000696e742d616464000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000764164647320616c6c20696e7075747320746f676574686572206173206e6f6e2d6e6567617469766520696e7465676572732e204572726f727320696620746865206164646974696f6e206578636565647320746865206d6178696d756d2076616c75652028726f7567686c7920312e3135653737292e00000000000000000000646563696d616c31382d616464000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000944164647320616c6c20696e7075747320746f67657468657220617320666978656420706f696e7420313820646563696d616c206e756d626572732028692e652e20276f6e65272069732031653138292e204572726f727320696620746865206164646974696f6e206578636565647320746865206d6178696d756d2076616c75652028726f7567686c7920312e3135653737292e000000000000000000000000696e742d64697600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064446976696465732074686520666972737420696e70757420627920616c6c206f7468657220696e70757473206173206e6f6e2d6e6567617469766520696e7465676572732e204572726f727320696620616e792064697669736f72206973207a65726f2e00000000000000000000000000000000000000000000000000000000696e742d657870000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a05261697365732074686520666972737420696e70757420746f2074686520706f776572206f6620616c6c206f7468657220696e70757473206173206e6f6e2d6e6567617469766520696e7465676572732e204572726f727320696620746865206578706f6e656e74696174696f6e20776f756c642065786365656420746865206d6178696d756d2076616c75652028726f7567686c7920312e3135653737292e696e742d6d61780000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000004146696e647320746865206d6178696d756d2076616c75652066726f6d20616c6c20696e70757473206173206e6f6e2d6e6567617469766520696e7465676572732e00000000000000000000000000000000000000000000000000000000000000646563696d616c31382d6d61780000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000005f46696e647320746865206d6178696d756d2076616c75652066726f6d20616c6c20696e7075747320617320666978656420706f696e7420313820646563696d616c206e756d626572732028692e652e20276f6e65272069732031653138292e00696e742d6d696e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000004146696e647320746865206d696e696d756d2076616c75652066726f6d20616c6c20696e70757473206173206e6f6e2d6e6567617469766520696e7465676572732e00000000000000000000000000000000000000000000000000000000000000646563696d616c31382d6d696e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000005f46696e647320746865206d696e696d756d2076616c75652066726f6d20616c6c20696e7075747320617320666978656420706f696e7420313820646563696d616c206e756d626572732028692e652e20276f6e65272069732031653138292e00696e742d6d6f64000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000644d6f64756c6f732074686520666972737420696e70757420627920616c6c206f7468657220696e70757473206173206e6f6e2d6e6567617469766520696e7465676572732e204572726f727320696620616e792064697669736f72206973207a65726f2e00000000000000000000000000000000000000000000000000000000696e742d6d756c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000824d756c7469706c69657320616c6c20696e7075747320746f676574686572206173206e6f6e2d6e6567617469766520696e7465676572732e204572726f727320696620746865206d756c7469706c69636174696f6e206578636565647320746865206d6178696d756d2076616c75652028726f7567686c7920312e3135653737292e000000000000000000000000000000000000000000000000000000000000696e742d7375620000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000007f53756274726163747320616c6c20696e707574732066726f6d2074686520666972737420696e707574206173206e6f6e2d6e6567617469766520696e7465676572732e204572726f727320696620746865207375627472616374696f6e20776f756c6420726573756c7420696e2061206e656761746976652076616c75652e00646563696d616c31382d7375620000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000009d53756274726163747320616c6c20696e707574732066726f6d2074686520666972737420696e70757420617320666978656420706f696e7420313820646563696d616c206e756d626572732028692e652e20276f6e65272069732031653138292e204572726f727320696620746865207375627472616374696f6e20776f756c6420726573756c7420696e2061206e656761746976652076616c75652e00000067657400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000424765747320612076616c75652066726f6d2073746f726167652e20546865206669727374206f706572616e6420697320746865206b657920746f206c6f6f6b75702e00000000000000000000000000000000000000000000000000000000000073657400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000685365747320612076616c756520696e2073746f726167652e20546865206669727374206f706572616e6420697320746865206b657920746f2073657420616e6420746865207365636f6e64206f706572616e64206973207468652076616c756520746f207365742e000000000000000000000000000000000000000000000000756e69737761702d76322d616d6f756e742d696e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001b6436f6d707574657320746865206d696e696d756d20616d6f756e74206f6620696e70757420746f6b656e7320726571756972656420746f20676574206120676976656e20616d6f756e74206f66206f757470757420746f6b656e732066726f6d206120556e6973776170563220706169722e20496e7075742f6f757470757420746f6b656e20646972656374696f6e73206172652066726f6d20746865207065727370656374697665206f662074686520556e697377617020636f6e74726163742e2054686520666972737420696e7075742069732074686520666163746f727920616464726573732c20746865207365636f6e642069732074686520616d6f756e74206f66206f757470757420746f6b656e732c207468652074686972642069732074686520696e70757420746f6b656e20616464726573732c20616e642074686520666f7572746820697320746865206f757470757420746f6b656e20616464726573732e20496620746865206f706572616e64206973203120746865206c6173742074696d652074686520707269636573206368616e6765642077696c6c2062652072657475726e65642061732077656c6c2e00000000000000000000756e69737761702d76322d616d6f756e742d6f757400000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001b3436f6d707574657320746865206d6178696d756d20616d6f756e74206f66206f757470757420746f6b656e732072656365697665642066726f6d206120676976656e20616d6f756e74206f6620696e70757420746f6b656e732066726f6d206120556e6973776170563220706169722e20496e7075742f6f757470757420746f6b656e20646972656374696f6e73206172652066726f6d20746865207065727370656374697665206f662074686520556e697377617020636f6e74726163742e2054686520666972737420696e7075742069732074686520666163746f727920616464726573732c20746865207365636f6e642069732074686520616d6f756e74206f6620696e70757420746f6b656e732c207468652074686972642069732074686520696e70757420746f6b656e20616464726573732c20616e642074686520666f7572746820697320746865206f757470757420746f6b656e20616464726573732e20496620746865206f706572616e64206973203120746865206c6173742074696d652074686520707269636573206368616e6765642077696c6c2062652072657475726e65642061732077656c6c2e00000000000000000000000000";

  const artifact = artifacts.readArtifactSync(
    "RainterpreterExpressionDeployerNP"
  );

  let signers = await ethers.getSigners();
  const expressionDeployerFactory = await ethers.getContractFactory(
    artifact.abi,
    artifact.bytecode,
    signers[0]
  );

  const deployerConfig: RainterpreterExpressionDeployerConstructionConfigStruct = {
    interpreter: interpreter,
    store: store,
    authoringMeta: bytes_,
  };

  const expressionDeployer = (await expressionDeployerFactory.deploy(
    deployerConfig
  )) ;

  console.log("expressionDeployer deployed");

  await expressionDeployer.deployed();
  console.log("ExpressionDeployer deployed to:", expressionDeployer.address);

  return expressionDeployer as RainterpreterExpressionDeployerNP;
};

deployExpressionDeployer()
  .then(() => {
    const exit = process.exit;
    exit(0);
  })
  .catch((error) => {
    console.error(error);
    const exit = process.exit;
    exit(1);
  });