import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define a function to check if the file type is valid
export const isValidFileType = (fileName: string): boolean => {
  const validExtensions = ['.jpg', '.png']; // Add more valid extensions as needed
  const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return validExtensions.includes(fileExtension);
};

export const isEmpty = (obj: {[key:string | number]:any} | null) => {
  if (obj === null) return true;
  return Object.keys(obj).length === 0;
}

export function formatDuration(timestamp: number) {
  const now = Math.floor(Date.now() / 1000);
  const differenceInSeconds = now - timestamp;

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} second${differenceInSeconds !== 1 ? 's' : ''} ago`;
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(differenceInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}

export function formatAddress(address: string, prefixLength: number = 5, suffixLength: number = 3): string {
  if (address.length < prefixLength + suffixLength) {
      throw new Error('Address length is too short');
  }

  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
}

export function convertEthToUsd(amount: number, exchangeRate: number): string {
  return (amount * exchangeRate).toFixed(2);
}