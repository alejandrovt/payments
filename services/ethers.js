import '@ethersproject/shims';
import * as ethers from 'ethers';

export const ethAddress = '0x299974AeD8911bcbd2C61262605b89F591a53E83';
export const polygonAddress = '0x332A8191905fA8E6eeA7350B5799F225B8ed30a9';
export const abi = [
  {
    constant: true,
    inputs: [
      {
        internalType: 'string[]',
        name: 'keys',
        type: 'string[]',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getData',
    outputs: [
      {
        internalType: 'address',
        name: 'resolver',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'string[]',
        name: 'values',
        type: 'string[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const abiSubdomain = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'string[]',
        name: 'labels',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'keys',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'values',
        type: 'string[]',
      },
    ],
    name: 'issueWithRecords',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
export const polygonSubdomainAddress =
  '0x428189346bb3CC52f031A1092fd47C919AC30A9f';

export const init = () => {
  const ethProvider = ethers.providers.getDefaultProvider('rinkeby');
  const polygonProvider = new ethers.providers.JsonRpcProvider(
    'https://polygon-mumbai.g.alchemy.com/v2/A3_FlqZTaLeaJeuWTiZEoGdeygz-o6n7',
  );

  const ethContract = new ethers.Contract(ethAddress, abi, ethProvider);
  const polygonContract = new ethers.Contract(
    polygonAddress,
    abi,
    polygonProvider,
  );
  console.log('ETHE. -----------------------------------------');
  console.log(polygonContract);
  console.log('ETHE. -----------------------------------------');

  const polygonSubdomainContract = new ethers.Contract(
    polygonSubdomainAddress,
    abiSubdomain,
    polygonProvider,
  );

  return [ethContract, polygonContract, polygonSubdomainContract];
};

export const fetchContractData = async (contract, keys, tokenId) =>
  contract.getData(keys, tokenId);
