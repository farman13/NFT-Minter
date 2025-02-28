import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import { useState, useRef } from 'react'
import { useAccount } from 'wagmi';


function App() {

  const [file, setFile] = useState();
  const [tokenID, setTokenId] = useState();
  const [txnHash, setTxnHash] = useState();
  const [ImgURL, setImgURL] = useState();
  const [loader, setLoader] = useState();

  const toAddress = useRef();
  const contractAddress = '0x57ab6c15fAeEa0402a1c8Aa8a68703Ded74E3f1B';
  const { address, isConnected } = useAccount();

  function handleChange(e) {
    const recentFile = e.target.files[0]
    setFile(recentFile);
    console.log(recentFile);
  }

  async function handleMint() {

    if (!isConnected) {
      alert("Please connect wallet!")
    }
    setLoader(true);
    toAddress.current = address;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('toAddress', toAddress.current);

    const response = await axios.post("http://localhost:3000/mintNFT", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const tokenId = response.data.tokenId;
    const txnhash = response.data.transactionHash;
    const imghash = response.data.imghash
    setTokenId(tokenId);
    setTxnHash(txnhash);
    setImgURL(`https://gateway.pinata.cloud/ipfs/${imghash}`)
    setLoader(false);
    console.log(tokenId);
    console.log(txnhash);

  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>
      {tokenID && txnHash && ImgURL && (
        <div className="mb-4 flex flex-col items-center">
          <div className="text-green-400 text-lg font-semibold mb-4">NFT Minted Successfully!</div>
          <img src={ImgURL} alt="Selected NFT" className="w-40 h-40 rounded-lg shadow-lg" />
          {tokenID && txnHash && (
            <div className="text-white text-sm mt-2">
              <p><strong>Token ID:</strong> {tokenID}</p>
              <p><strong>Contract Address:</strong> {contractAddress}</p>
              <p><strong>Transaction Hash:</strong> {txnHash}</p>
            </div>
          )}
        </div>
      )}
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center w-96">
        <h2 className="text-white text-2xl font-semibold">Mint Your NFT</h2>

        <label htmlFor="fileInput" className="block text-gray-400 mt-4">
          Choose your image to Mint:
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleChange}
          className="mt-2 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white cursor-pointer"
        />
        {loader ? (
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <button
            onClick={handleMint}
            disabled={loader}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition cursor-pointer disabled:bg-gray-600"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  )
}

export default App;
