import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import "../index.css";

const NFTCard = ({ nft, setOwnedNFTs }) => {
  const { contracts, accounts, setActiveSkin, activeSkin, setActiveBackground, activeBackground } = useGlobalContext();

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [isChangesApplied, setIsChangesApplied] = useState(false); // For managing the pop-up visibility

  const handleChange = () => {
    if (nft.type === "spaceship") setActiveSkin(nft.image);
    else setActiveBackground(nft.image);

    // Show the pop-up after applying changes
    setIsChangesApplied(true);

    // Hide the pop-up after 3 seconds
    setTimeout(() => {
      setIsChangesApplied(false);
    }, 3000);
  };

  useEffect(() => {
    console.log("Updated activeSkin:", activeSkin);
  }, [activeSkin]);

  const handleListNFT = () => {
    console.log(price);
    console.log(contracts.NFT_MarketPlace._address);
  
    if (price <= 0) return;
  
    const listNFT = async () => {
      try {
        // Approve the NFT for the marketplace
        await contracts.NFT_MarketPlace.methods
          .approve(contracts.NFT_MarketPlace._address, nft.tokenId)
          .send({ from: accounts[0] });
  
        // List the NFT on the marketplace
        await contracts.NFT_MarketPlace.methods
          .listNFT(nft.tokenId, price)
          .send({ from: accounts[0] });
  
        console.log(`NFT with Token ID ${nft.tokenId} listed for sale.`);

        setOwnedNFTs((prevNFTs) =>
          prevNFTs.filter((ownedNFT) => ownedNFT.tokenId !== nft.tokenId)
        );

        setIsListModalOpen(false);
  
      } catch (error) {
        console.error("Failed to list NFT for sale:", error);
      }
    };
  
    listNFT();
  };

  return (
    <div className="w-64 p-4 rounded-lg bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-lg mt-5">
      <div className="w-fill h-40 md:h-60 flex items-center justify-center bg-gray-600 rounded-md overflow-hidden">
        <img
          src={nft.image}
          alt={nft.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="mt-4 text-center">
        <h4 className="text-xl font-semibold text-gray-200">{nft.name}</h4>
        <p className="text-sm text-gray-400 mt-2">{nft.description}</p>
      </div>
      <div className="mt-4 flex justify-center gap-5">
        <button
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold"
          onClick={() => setIsListModalOpen(!isListModalOpen)}
        >
          List
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold"
          onClick={handleChange}
        >
          Use
        </button>
      </div>

      {isListModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-11/12 md:w-1/3">
            <h3 className="text-2xl font-bold mb-4">Select Price</h3>
            <input
              className="p-3 w-full rounded-md bg-gray-700 text-white text-lg mb-6"
              type="number"
              value={price}
              placeholder="Enter price"
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={() => setIsListModalOpen(false)}
                className="px-6 py-2 w-36 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white font-bold hover:from-pink-500 hover:to-red-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleListNFT}
                className="px-6 py-2 w-36 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white font-bold hover:from-blue-500 hover:to-green-500 transition-all"
              >
                List
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isChangesApplied && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-11/12 md:w-1/3">
            <h3 className="text-xl font-semibold text-green-500">Changes Applied!</h3>
            <p className="text-sm text-gray-300 mt-2">Your spaceship or background has been updated.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTCard;
