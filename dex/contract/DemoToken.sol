pragma solidity ^0.4.23;

import {DSToken} from './dappsys.sol';

contract DemoOAX is DSToken("OAX") {
  uint8 public decimals = 18;

  function DemoOAX() public {
    setName("Demo OAX");
    mint(100e6 * 1e18);
  }
}

contract DemoSWIMUSD is DSToken("SWIMUSD") {
  uint8 public decimals = 18;

  function DemoSWIMUSD() public {
    setName("Demo SWIMUSD");
    mint(200e6 * 1e18);
  }
}
