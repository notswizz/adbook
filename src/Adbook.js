import Web3 from 'web3';
import contractABI from './abi.json';

const contractAddress = '0x01f1dd70ffcc273e4abe3e279b142d10ec9c57ab'; // Replace with your contract address

export const connectToBlockchain = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    return { web3, account: accounts[0] };
  } else {
    alert('Please install MetaMask to use this app.');
    return { web3: null, account: null };
  }
};

export const addNameAndWallet = async (web3, account, name, walletAddress) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  await contract.methods.addNameAndWallet(name, walletAddress).send({ from: account });
};

export const getNamesAndWallets = async (web3, account) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const pairs = await contract.methods.getMyNamesAndWallets().call({ from: account });
  return pairs;
};

export const deleteNameAndWallet = async (web3, account, index) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  await contract.methods.deleteNameAndWallet(index).send({ from: account });
};
