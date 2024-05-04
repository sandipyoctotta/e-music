import axios from "axios";
import { ethers } from "ethers";
import React, { useState } from "react";
import contractABI from "../src/abi/MeMusic.json";
import { FaSpinner } from "react-icons/fa";

const Loader = ({ type }) => {
  return (
    <div className="loader-container">
      <FaSpinner className="spinner" />
      <h3
        style={{
          color: "#000",
          fontWeight: "bold",
        }}
      >
        {type}
      </h3>
    </div>
  );
};

const FileUploadButton = ({ onFileSelect }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState("");

  const handleFileSelect = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "audio/*";
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      sendFileToIPFS(file);
      onFileSelect(file);
    });
    fileInput.click();
  };
  const sendFileToIPFS = async (e) => {
    if (e) {
      try {
        setUploading(true);
        setUploadType("File Uploading...");
        const formData = new FormData();
        formData.append("file", e);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "4bed5c1d8c93486ff9d6",
            pinata_secret_api_key: `37bd7f874073d0b36e7d94f4c65f345ae860fb44e476a7ebe52dfb64ba455aeb`,
            "Content-Type": `multipart/form-data;boundary= ${formData._boundary}`,
          },
        });
        setUploadType("File Uploaded...");
        setUploadType("Uploading the config...");

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        const uid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            var r = (Math.random() * 16) | 0,
              v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
        console.log({ name: `${uid}.json` });
        const resJson = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: JSON.stringify({
            pinataOptions: { cidVersion: 1 },
            pinataMetadata: { name: `${e.name.split(".")[0]}.json` },
            pinataContent: {
              music: ImgHash,
              name: e.name,
              size: e.size,
            },
          }),
          headers: {
            pinata_api_key: "4bed5c1d8c93486ff9d6",
            pinata_secret_api_key: `37bd7f874073d0b36e7d94f4c65f345ae860fb44e476a7ebe52dfb64ba455aeb`,
            "Content-Type": `application/json`,
          },
        });
        const JsonHash = `ipfs://${resJson.data.IpfsHash}`;
        setUploadType("Config Uploaded...");
        setUploading(false);
        mintNFT(JsonHash);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  const mintNFT = async (metadataURI) => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature!");
      return;
    }

    try {
      setUploading(true);
      setUploadType("Minting in progress...");
      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create a new instance of the ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a new instance of the contract
      const contract = new ethers.Contract(
        "0x4752CdC1dFe7c5d213a65C91D2973663d6b7A4F8",
        contractABI.abi,
        signer
      );

      // The address to receive the NFT (should be the user's address)
      const recipientAddress = await signer.getAddress();

      // Call the mintNFT function
      const transactionResponse = await contract.mintNFT(
        recipientAddress,
        metadataURI
      );
      await transactionResponse.wait(); // Wait for the transaction to be mined

      console.log(transactionResponse);
      alert("NFT Minted Successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Error minting NFT. See the console for more details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: "absolute", right: 0 }}>
      {uploading ? <Loader type={uploadType} /> : <></>}
      <button
        onClick={handleFileSelect}
        style={{
          height: 30,
          width: 100,
          borderRadius: 14,
          backgroundColor: "#8594e4",
          borderWidth: 1,
          marginTop: 90,
          fontFamily: "sans-serif",
          marginRight: 10,
        }}
      >
        Upload
      </button>
    </div>
  );
};
export default FileUploadButton;
