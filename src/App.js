import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

import contractABI from './abi.json';
const contractAddress = '0xed2b2109948934cf9f53e81f04fbf0e24f297ee9'; // Replace with your contract address

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [name, setName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [nameWalletPairs, setNameWalletPairs] = useState([]);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        setContract(contract);
        setAccount(accounts[0]);
        console.log('Connected account:', accounts[0]);
      } else {
        console.log('Please install MetaMask.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const handleAddNameAndWallet = async () => {
    try {
      await contract.methods.addNameAndWallet(name, walletAddress).send({ from: account });
      console.log('Name and wallet address added:', name, walletAddress);
    } catch (error) {
      console.error('Error adding name and wallet address:', error);
    }
  };

  const handleGetNamesAndWallets = async () => {
    try {
      const pairs = await contract.methods.getNamesAndWallets().call();
      setNameWalletPairs(pairs);
      console.log('Retrieved name and wallet pairs:', pairs);
    } catch (error) {
      console.error('Error retrieving name and wallet pairs:', error);
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
      <button onClick={loadBlockchainData}>Connect to MetaMask</button>
      {account && <p>Connected Wallet: {account}</p>}
      {contract && (
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <br></br>
          <input
            type="text"
            placeholder="Wallet Address"
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
          />
          <br></br>
          <button onClick={handleAddNameAndWallet}>Add Name and Wallet</button>
          <br></br>
          <button onClick={handleGetNamesAndWallets}>Get Names and Wallets</button>
          <ul>
            {nameWalletPairs.map((pair, index) => (
              <li key={index}>
                {pair.name} - {pair.walletAddress}
                <button onClick={() => copyToClipboard(pair.walletAddress)}>Copy</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
