import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import './App.css';

import contractABI from './abi.json';
const contractAddress = '0x01f1dd70ffcc273e4abe3e279b142d10ec9c57ab'; // Replace with your contract address

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [name, setName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [nameWalletPairs, setNameWalletPairs] = useState([]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setWeb3(web3);
        setAccount(accounts[0]);
      } else {
        alert('Please install MetaMask to use this app.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const loadBlockchainData = useCallback(async () => {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    setContract(contract);
  }, [web3]);

  useEffect(() => {
    if (web3 && account) {
      loadBlockchainData();
    }
  }, [web3, account, loadBlockchainData]);

  const handleAddNameAndWallet = async () => {
    try {
      await contract.methods.addNameAndWallet(name, walletAddress).send({ from: account });
      console.log('Name and wallet address added:', name, walletAddress);
      setName('');
      setWalletAddress('');
    } catch (error) {
      console.error('Error adding name and wallet address:', error);
    }
  };

  const handleGetNamesAndWallets = async () => {
    try {
      const pairs = await contract.methods.getMyNamesAndWallets().call({ from: account });
      setNameWalletPairs(pairs);
    } catch (error) {
      console.error('Error retrieving my name and wallet pairs:', error);
    }
  };

  const handleDeleteNameAndWallet = async (index) => {
    try {
      await contract.methods.deleteNameAndWallet(index).send({ from: account });
      console.log('Name and wallet pair deleted at index:', index);
      handleGetNamesAndWallets();
    } catch (error) {
      console.error('Error deleting name and wallet pair:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied: ${text}`);
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="App">
      {!account && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {account && (
        <div>
          <p>Connected Wallet: {account}</p>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Wallet Address"
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
          />
          <button onClick={handleAddNameAndWallet}>Add Name and Wallet</button>
          <button onClick={handleGetNamesAndWallets}>Get My Names and Wallets</button>
          <ul>
            {nameWalletPairs.map((pair, index) => (
              <li key={index}>
                {pair.name} - {pair.walletAddress}
                <button onClick={() => copyToClipboard(pair.walletAddress)}>Copy</button>
                <button onClick={() => handleDeleteNameAndWallet(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
