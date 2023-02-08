import {keccak256} from 'js-sha3';
import {fetchContractData} from './ethers';

const ZILLIQA_API = 'https://api.zilliqa.com/';
const UD_REGISTRY_CONTRACT_ADDRESS = '9611c53BE6d1b32058b2747bdeCECed7e1216793';

export const namehash = (name: any) => arrayToHex(hash(name));

export const hash = (name: any): any => {
  if (!name) {
    return new Uint8Array(32);
  }
  const [label, ...remainder] = name.split('.');
  const labelHash = keccak256.array(label);
  const remainderHash = hash(remainder.join('.'));

  return keccak256.array(new Uint8Array([...remainderHash, ...labelHash]));
};

const arrayToHex = (array: any) =>
  '0x' +
  Array.prototype.map
    .call(array, x => ('00' + x.toString(16)).slice(-2))
    .join('');

const isEmpty = (message: any) => {
  return !message || message === '0x0000000000000000000000000000000000000000';
};

const combineKeysWithRecords = (keys: any, records: any) => {
  const combined: any = {};
  keys.map((key: any, index: any) => {
    combined[key] = records[index];
  });
  return combined;
};

export async function resolveEthNetwork(
  ethContract: any,
  tokenId: any,
  interestedKeys: any,
) {
  console.log('3.1 -----------------------------------------');
  const data = await fetchContractData(ethContract, interestedKeys, tokenId);
  console.log('3.2 -----------------------------------------');
  if (isEmpty(data.owner)) {
    return 'Domain is not registered';
  }

  if (isEmpty(data.resolver)) {
    return 'Domain does not have resolver';
  }
  console.log('3.3 -----------------------------------------');
  return {
    ownerAddress: data.owner,
    resolverAddress: data.resolver,
    records: combineKeysWithRecords(interestedKeys, data[2]),
  };
}

export async function resolveBothChains(
  polygonContract: any,
  ethContract: any,
  tokenId: any,
  interestedKeys: any,
) {
  console.log('2. -----------------------------------------');
  // try to resolve the polygon network first
  const data = await fetchContractData(
    polygonContract,
    interestedKeys,
    tokenId,
  );
  console.log('3. -----------------------------------------');

  if (isEmpty(data.owner)) {
    // if no owner for domain found on polygon look up the eth network
    return resolveEthNetwork(ethContract, tokenId, interestedKeys);
  }
  console.log('4. -----------------------------------------');

  if (isEmpty(data.resolver)) {
    return 'Domain does not have resolver';
  }

  return {
    ownerAddress: data.owner,
    resolverAddress: data.resolver,
    records: combineKeysWithRecords(interestedKeys, data[2]),
  };
}

export const fetchZilliqa = async (params: any) => {
  const body = {
    method: 'GetSmartContractSubState',
    id: '1',
    jsonrpc: '2.0',
    params,
  };

  return await fetch(ZILLIQA_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(res => res.json());
};

export const resolveZilliqaNetwork = async (tokenId: any) => {
  const registryState = await fetchZilliqa([
    UD_REGISTRY_CONTRACT_ADDRESS,
    'records',
    [tokenId],
  ]);

  if (registryState.result == null) {
    return 'domain is not registered';
  }

  const [ownerAddress, resolverAddress] =
    registryState.result.records[tokenId].arguments;

  if (resolverAddress === '0x0000000000000000000000000000000000000000') {
    return 'domain is not configured';
  }

  const recordResponse = await fetchZilliqa([
    resolverAddress.replace('0x', ''),
    'records',
    [],
  ]);

  return {
    ownerAddress,
    resolverAddress,
    records: recordResponse.result.records,
  };
};
