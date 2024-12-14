import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGlobalContext } from "../context";
import "../utilities/scrollable.css";

const Market = () => {
  const { contracts, accounts } = useGlobalContext();
  const [selectedItem, setSelectedItem] = useState(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const skinsRef = useRef(null);
  const backgroundsRef = useRef(null);
  const skinsItemsRef = useRef([]);
  const backgroundsItemsRef = useRef([]);
  const overlayRef = useRef(null);

  const [spaceshipNFTs, setSpaceshipNFTs] = useState([]);
  const [backgroundNFTs, setBackgroundNFTs] = useState([]);

  const handleBuyNFT = (e) => {
    const buyNFT = async () => {
      try {
        const result = await contracts.NFT_MarketPlace.methods
          .buyNFT(selectedItem.tokenId.tokenId)
          .send({
            from: accounts[0],
            value: selectedItem.price,
          });
  
        console.log("Purchase successful:", result);
  
        // Update the NFTs state to remove the purchased item
        if (selectedItem.type === "spaceship") {
          setSpaceshipNFTs((prevNFTs) =>
            prevNFTs.filter((nft) => nft.tokenId.tokenId !== selectedItem.tokenId.tokenId)
          );
        } else if (selectedItem.type === "background") {
          setBackgroundNFTs((prevNFTs) =>
            prevNFTs.filter((nft) => nft.tokenId.tokenId !== selectedItem.tokenId.tokenId)
          );
        }

        setSelectedItem(null);
      } catch (error) {
        console.error("Error during purchase:", error);
      }
    };
  
    buyNFT();
  };
  

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );

    gsap.fromTo(
      subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power4.out" }
    );

    gsap.fromTo(
      [skinsRef.current, backgroundsRef.current],
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.2, delay: 0.7, ease: "power4.out" }
    );

    const getNFTs = async () => {
      const tokenIds = await contracts.NFT_MarketPlace.methods
        .getListedNFTs()
        .call({ from: accounts[0] });

      const fetchNFTData = async (tokenId) => {
        const tokenURI = await contracts.NFT_MarketPlace.methods
          .tokenURI(tokenId.tokenId)
          .call({ from: accounts[0] });
        const dataUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        const response = await fetch(dataUrl);
        let jsonData = await response.json();
        jsonData.image = jsonData.image.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        jsonData.tokenId = tokenId;
        jsonData.price = tokenId.price;
        return jsonData;
      };

      const NFTs = await Promise.all(tokenIds.map(fetchNFTData));

      let spaceships = [];
      for (let i = 0; i < NFTs.length; i++) {
        if (NFTs[i].type === "spaceship") {
          spaceships.push(NFTs[i]);
        }
      }
      setSpaceshipNFTs(spaceships);

      let backgrounds = [];
      for (let i = 0; i < NFTs.length; i++) {
        if (NFTs[i].type === "background") {
          backgrounds.push(NFTs[i]);
        }
      }
      setBackgroundNFTs(backgrounds);
    };

    getNFTs();
  }, [contracts, accounts]);

  const closeOverlay = () => setSelectedItem(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 flex flex-col items-center text-white overflow-hidden">
      <h1
        ref={titleRef}
        className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-10"
      >
        Galactic Marketplace
      </h1>
      <p ref={subtitleRef} className="text-gray-400 mt-4 text-lg md:text-xl">
        Buy exclusive rocket skins and space backgrounds for your journey!
      </p>

      <div
        ref={skinsRef}
        className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-2/4 max-h-80 overflow-y-auto scrollable-container z-10"
      >
        <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">
          Rocket Skins
        </h2>
        {spaceshipNFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spaceshipNFTs.map((skin, index) => (
              <div
                ref={(el) => (skinsItemsRef.current[index] = el)}
                key={index}
                className="w-64 p-4 rounded-lg bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-lg"
                onClick={() => setSelectedItem(skin)}
              >
                <div className="w-full h-40 md:h-60 flex items-center justify-center bg-gray-600 rounded-md overflow-hidden">
                  <img
                    src={skin.image}
                    alt={skin.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h4 className="text-xl font-semibold text-gray-200">
                    {skin.name}
                  </h4>
                  <p className="text-sm text-gray-400 mt-2">{skin.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No Rocket Skins available.</p>
        )}
      </div>
 
      <div
        ref={backgroundsRef}
        className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-2/4 max-h-80 overflow-y-auto scrollable-container mb-10"
      >
        <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">
          Space Backgrounds
        </h2>
        {backgroundNFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {backgroundNFTs.map((background, index) => (
              <div
                ref={(el) => (backgroundsItemsRef.current[index] = el)}
                key={index}
                className="w-64 p-4 rounded-lg bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-lg"
                onClick={() => setSelectedItem(background)}
              >
                <div className="w-full h-40 md:h-60 flex items-center justify-center bg-gray-600 rounded-md overflow-hidden">
                  <img
                    src={background.image}
                    alt={background.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h4 className="text-xl font-semibold text-gray-200">
                    {background.name}
                  </h4>
                  <p className="text-sm text-gray-400 mt-2">
                    {background.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No Space Backgrounds available.
          </p>
        )}
      </div>
  
      {selectedItem && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-11/12 md:w-1/3">
            <h3 className="text-2xl font-bold mb-4">{selectedItem.name}</h3>
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="object-cover w-full h-full rounded-md mb-4"
            />
            <p className="text-lg font-semibold text-gray-300 mb-6">
              Price: {Number(selectedItem.price)}
            </p>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={closeOverlay}
                className="px-6 py-2 w-36 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white font-bold hover:from-pink-500 hover:to-red-500 transition-all"
              >
                Close
              </button>
              <button
                onClick={handleBuyNFT}
                className="px-6 py-2 w-36 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white font-bold hover:from-blue-500 hover:to-green-500 transition-all"
              >
                Purchase
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Floating Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-20 w-16 h-16 bg-blue-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
  
};

export default Market;
