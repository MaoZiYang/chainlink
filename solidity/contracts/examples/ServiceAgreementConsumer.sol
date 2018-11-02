pragma solidity ^0.4.24;

import "../Chainlinked.sol";

// This contract is to be subclassed by consumer's of ServiceAgreements.
// Currently, all it does is provide a pass-through interface to
// Coordinator.executeServiceAgreement, which we may have to reference directly
// in the consumer contract. So we might want to get rid of this.
contract ServiceAgreementConsumer is Chainlinked {
  bytes32 internal sAId;
  bytes32 public currentPrice;

  event RequestFulfilled(
    bytes32 indexed requestId,
    bytes32 indexed data
  );

  constructor(address _link, address _coordinator, bytes32 _sAId) public {
    setLinkToken(_link);
    setOracle(_coordinator);
    sAId = _sAId;
  }

  function requestEthereumPrice(string _currency) public {
    ChainlinkLib.Run memory run = newRun(sAId, this, "fulfill(bytes32,bytes32)");
    run.add("url", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY");
    string[] memory path = new string[](1);
    path[0] = _currency;
    run.addStringArray("path", path);
    serviceRequest(run, LINK(1));
  }

  function fulfill(bytes32 _requestId, bytes32 _price)
    public
    checkChainlinkFulfillment(_requestId)
  {
    // XXX: This is a bad example for a ServiceAgreement, because it assumes a
    // single Oracle. Somewhere, there needs to be storage and aggregation of
    // each Oracle's response. It's not clear where that should happen. Maybe in
    // Coordinator#fulfillData?
    emit RequestFulfilled(_requestId, _price);
    currentPrice = _price;
  }

  function cancelRequest(bytes32 _requestId) public {
    cancelChainlinkRequest(_requestId);
  }
}
