"use client"
import React, { useState } from 'react';
import { ethers } from 'ethers';

const GenerateWalletComponent = () => {
  const [address, setAddress] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const generateWallet = () => {
    // Generate a new wallet
    const wallet = ethers.Wallet.createRandom();

    // Get the generated values
    const generatedAddress = wallet.address;
    const generatedSeedPhrase = wallet.mnemonic.phrase;
    const generatedPrivateKey = wallet.privateKey;

    // Update state
    setAddress(generatedAddress);
    setSeedPhrase(generatedSeedPhrase);
    setPrivateKey(generatedPrivateKey);
  };

  return (
    <div>
      <h2>Generate Wallet</h2>
      <button onClick={generateWallet}>Generate Wallet</button>
      <div>
        <strong>Address:</strong> {address}
      </div>
      <div>
        <strong>Seed Phrase:</strong> {seedPhrase}
      </div>
      <div>
        <strong>Private Key:</strong> {privateKey}
      </div>
    </div>
  );
};

export default GenerateWalletComponent;
