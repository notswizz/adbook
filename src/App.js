import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import {
  connectToBlockchain,
  addNameAndWallet,
  getNamesAndWallets,
  deleteNameAndWallet,
} from './Adbook';

const sepoliaChainId = '0xaa36a7'; // Sepolia Chain ID in hexadecimal

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [name, setName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [nameWalletPairs, setNameWalletPairs] = useState([]);

  const connectWallet = async () => {
    try {
      const { web3, account } = await connectToBlockchain();
      setWeb3(web3);
      setAccount(account);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const loadBlockchainData = useCallback(async () => {
    try {
      const pairs = await getNamesAndWallets(web3, account);
      setNameWalletPairs(pairs);
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  }, [web3, account]);

  useEffect(() => {
    if (web3 && account) {
      const checkCurrentChain = async () => {
        const chainId = await web3.eth.getChainId();
        if (`0x${chainId.toString(16)}` !== sepoliaChainId) {
          // You might want to handle this case
          console.log('Not connected to Sepolia');
        }
      };

      loadBlockchainData();
      checkCurrentChain();
    }
  }, [web3, account, loadBlockchainData]);

  const handleAddNameAndWallet = async () => {
    try {
      await addNameAndWallet(web3, account, name, walletAddress);
      setName('');
      setWalletAddress('');
      loadBlockchainData();
    } catch (error) {
      console.error('Error adding name and wallet address:', error);
    }
  };

  const handleDeleteNameAndWallet = async (index) => {
    try {
      await deleteNameAndWallet(web3, account, index);
      loadBlockchainData();
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
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button onClick={handleAddNameAndWallet}>Add Name and Wallet</button>
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
