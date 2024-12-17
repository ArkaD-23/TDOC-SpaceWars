import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGlobalContext } from "../context";
import NFTCard from "../components/NFTCard.jsx";
import { useStorage } from "@thirdweb-dev/react";

const Profile = () => {
  const storage = useStorage();

  const { contracts, accounts } = useGlobalContext();
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const nftSectionRef = useRef(null);

  const [username, setUsername] = useState("userName");
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [mintData, setMintData] = useState({
    type: "",
    name: "",
    description: "",
    image: null,
  });
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [isMinting, setIsMinting] = useState(false);

  const handleMintNFT = () => {
    const mintNFT = async (uri) => {
      try {
        const tokenId = await contracts.NFT_MarketPlace.methods
          .createNFT(uri)
          .send({ from: accounts[0] });
        console.log("NFT minted with token ID:", tokenId);
      } catch (error) {
        console.error("Minting failed:", error);
      }
    };

    const ipfsUpload = async () => {
      const uri = await storage.upload(mintData);
      console.log(uri);
      mintNFT(uri);
    };

    setIsMinting(true);

    ipfsUpload();

    setIsMinting(false); // Set minting back to false after the process is done
    setIsMintModalOpen(false);
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
      nftSectionRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.2, delay: 0.7, ease: "power4.out" }
    );
  }, []);

  useEffect(() => {
    const getPlayerName = async () => {
      const name = await contracts.SpaceWars.methods
        .getPlayerName()
        .call({ from: accounts[0] });
      setUsername(name);
    };

    const getNFTs = async () => {
      const tokenIds = await contracts.NFT_MarketPlace.methods
        .getOwnedNFTs()
        .call({ from: accounts[0] });
      console.log(tokenIds);

      const fetchNFTData = async (tokenId) => {
        const tokenURI = await contracts.NFT_MarketPlace.methods
          .tokenURI(tokenId)
          .call({ from: accounts[0] });
        const dataUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        const response = await fetch(dataUrl);
        let jsonData = await response.json();
        jsonData.image = jsonData.image.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        jsonData.tokenId = tokenId;
        return jsonData;
      };

      const NFTs = await Promise.all(tokenIds.map(fetchNFTData));

      console.log(NFTs);
      setOwnedNFTs(NFTs);
    };

    getPlayerName();
    getNFTs();
  }, [contracts, accounts]);

  const handleMintInputChange = (e) => {
    const { name, value, files } = e.target;
    setMintData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 flex flex-col items-center text-white">
      <div className="text-center mt-10">
        <h1
          ref={titleRef}
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        >
          {username}
        </h1>
        <p ref={subtitleRef} className="text-gray-400 mt-2 text-lg md:text-xl">
          Your collection of exclusive NFTs
        </p>
      </div>
      <div
        ref={nftSectionRef}
        className="mt-10 w-11/12 md:w-2/4 bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-200 mb-6">
          Owned NFTs
        </h2>

        {ownedNFTs.length > 0 ? (
          <div className="grid grid-cols-3">
            {ownedNFTs.map((NFT, index) => (
              <NFTCard nft={NFT} key={index} setOwnedNFTs={setOwnedNFTs} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No NFTs in your collection yet.
          </p>
        )}
      </div>

      <button
        onClick={() => setIsMintModalOpen(true)}
        className="mt-8 p-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500  text-lg py-3 hover:from-purple-500 hover:to-blue-500 text-white font-bold mb-5"
      >
        {isMinting ? "Minting..." : "Mint New NFT"}
      </button>

      {isMintModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-3xl font-semibold text-center text-gray-200 mb-6">
              Mint NFT
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="NFT Name"
                className="p-3 rounded-lg bg-gray-700 text-white"
                value={mintData.name}
                onChange={handleMintInputChange}
              />
              <textarea
                name="description"
                placeholder="NFT Description"
                className="p-3 rounded-lg bg-gray-700 text-white"
                value={mintData.description}
                onChange={handleMintInputChange}
              />
              <select
                name="type"
                className="p-3 rounded-lg bg-gray-700 text-white"
                value={mintData.type}
                onChange={handleMintInputChange}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="spaceship">Spaceship</option>
                <option value="background">Background</option>
              </select>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="p-3 rounded-lg bg-gray-700 text-white"
                onChange={handleMintInputChange}
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="p-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold"
                  onClick={() => setIsMintModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold"
                  onClick={handleMintNFT}
                >
                  Mint NFT
                </button>
              </div>
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

export default Profile;
