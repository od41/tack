"use client"
import React, { useState } from 'react';

const CopyToClipboardButton = ({ textToCopy }: {textToCopy: string}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div>
      <button onClick={handleCopyClick}>
        {isCopied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
    </div>
  );
};

export default CopyToClipboardButton;
