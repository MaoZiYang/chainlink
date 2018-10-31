pragma solidity ^0.4.24;

import "../Chainlinked.sol";
import "./ChainlinkLib.sol";
import "./Coordinator.sol";
import "./ENSResolver.sol";
import "./interfaces/ENSInterface.sol";
import "./interfaces/LinkTokenInterface.sol";
import "./interfaces/OracleInterface.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

// This contract is to be subclassed by consumer's of ServiceAgreements.
// Currently, all it does is provide a pass-through interface to
// Coordinator.executeServiceAgreement, which we may have to reference directly
// in the consumer contract. So we might want to get rid of this.
contract ServiceAgreementConsumer {
  using Chainlinklib for Chainlinklib.Run
  using SafeMath for uint256;

  // Number of the smallest unit of LINK (i.e., a "LINK-wei") which fits in 1 LINK 
  uint256 constant private linkDivisibility = 10**18;

  Coordinator coordinator;
  bytes32 sAId;
  mapping (bytes32 => uint) totals; // requestID => total of observed values
  mapping (bytes32 => uint) sampleSize;  // requestID => number of observed values

  function constructor(address _coordinator, bytes32 _sAId, uint256 _version) {
    coordinator = _coordinator;  // XXX: Make a minimal interface for this, a la OracleInterface
    _sAId = _sAId;
  }

  event RequestFulfilled(
    bytes32 indexed requestId,
    bytes32 indexed data
  );

  // https://github.com/smartcontractkit/chainlink/wiki/Protocol-Information
  // 5. The Requester directs the Oracle nodes to create a Run of the Job
  // Specification. (a) This request could be sent directly to the Oracle
  // Contract, or be routed through the Consuming Contract. We believe going
  // through the Consuming Contract will be more common, so that is how it’s
  // represented here:

  // - Requester calls ExecuteServiceAgreement on the Consuming Contract with:
  //   + SAID
  //   + This Run Request’s parameters
  function executeServiceAgreement(
    uint256 _amount,
    address _callbackAddress,
    bytes4 _callbackFunctionId,
    bytes32 _externalId,
    bytes _data
  )
    public
    onlyLINK
    sufficientLINK(_amount, _sAId)
  {
    coordinator.executeServiceAgreement(
      msg.sender, // XXX: Is this correct?
      _amount, _version, SAId, _callbackAddress, callbackFunctionId, _externalId, _data)
      }

  function fulfillServiceAgreement(bytes32 _requestId, uint256 _value)
    public
    checkChainlinkFulfillment(_requestId)
  {
    emit RequestFulfilled(_requestId, _value);
    totals[_requestId] += _value;
    sampleSize[_requestId] += 1;
  }

  function averageAnswer(bytes32 _requestId)
    public (uint256 average)
  {
    average = totals[_requestId] / sampleSize[_requestId];
  }

  // - (Also from 5.) Consumer Contract calls RequestRun on the Oracle Contract with:
  //   + SAID
  //   + This Run Request’s parameters
  //   + Callback address
  //   + Callback function selector

  // But I think I'm going to ignore that. It's just silly for a requester to
  // behave this way, because it burns so much gas.
  // Coordinator#executeServiceAgreement is generating a RunRequest log which
  // Oracles can look for much more efficiently.
