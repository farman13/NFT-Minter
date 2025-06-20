const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { JsonRpcProvider, Wallet, Contract, id } = require('ethers');
const { abi } = require('./ABI/NFT.json');
const cors = require('cors');
require('dotenv').config();

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello from server")
})

app.post('/mintNFT', upload.single('file'), async function (req, res) {

    const imgfile = req.file;
    const toAddress = req.body.toAddress;

    const imghash = await postImg(imgfile);
    const imgMetadatahash = await postImgmetdata(imgfile, imghash);

    const txnReceipt = await mintNFTs(toAddress, imgMetadatahash);
    console.log("receipt", txnReceipt)
    // console.log("txn", txn);
    // console.log("Transaction mined:", txn.hash);

    const logs = await provider.getLogs({
        address: contractAddress,
        fromBlock: txnReceipt.blockNumber,
        toBlock: txnReceipt.blockNumber,
        topics: [id("MetadataUpdate(uint256)")]
    })
    console.log("logs", logs.length);
    console.log(logs);
    const log = logs[0];

    const hexValue = log.data.startsWith('0x') ? log.data.slice(2) : log.data;

    // Convert the hex value to decimal
    const tokenId = parseInt(hexValue, 16).toString();

    res.json({
        transactionHash: txnReceipt.hash,
        tokenId: tokenId,
        imghash: imghash
    })
})


async function postImg(imgfile) {

    const formData = new FormData();
    formData.append('file', imgfile.buffer, imgfile.originalname);

    const response = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: formData,
        headers: {
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        }
    });

    const ipfsHash = response.data.IpfsHash;
    console.log('File uploaded to IPFS with hash:', ipfsHash);
    return ipfsHash;
}

async function postImgmetdata(imgfile, Imghash) {

    const ImgName = imgfile.originalname.replace(/\.[^/.]+$/, "");

    const metadataJson = {
        name: ImgName,
        description: `Probably the most awesome NFT ever created !`,
        image: `https://gateway.pinata.cloud/ipfs/${Imghash}`
    }

    const metadataString = JSON.stringify(metadataJson);
    const metadataBuffer = Buffer.from(metadataString);

    const formData = new FormData();
    formData.append('file', metadataBuffer, imgfile.originalname + "metadata");

    const response = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: formData,
        headers: {
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
        }
    });

    const ipfsHash = response.data.IpfsHash;
    console.log('Metadata uploaded to IPFS with hash:', ipfsHash);
    return ipfsHash;

}

const provider = new JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = '0x57ab6c15fAeEa0402a1c8Aa8a68703Ded74E3f1B'

function getWallet() {
    const wallet = new Wallet(privateKey, provider)
    return wallet;
}

async function mintNFTs(toAddress, imgMetadatahash) {

    const wallet = getWallet();
    const nftContract = new Contract(contractAddress, abi, wallet);

    const tokenURI = `https://gateway.pinata.cloud/ipfs/${imgMetadatahash}`
    const txn = await nftContract.mintNFT(toAddress, tokenURI);
    const receipt = await txn.wait();
    return receipt;
}

app.listen(3000);
