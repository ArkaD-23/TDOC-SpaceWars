import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGlobalContext } from "../context";

const Profile = () => {
  const { contracts, accounts } = useGlobalContext();
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const [username, setUsername] = useState("userName");

  // Hardcoded NFTs
  const ownedNFTs = {
    skins: [
      {
        name: "Cosmo Cruiser",
        image: "https://via.placeholder.com/150/001d3d/fff?text=Cosmo+Cruiser",
        price: "0.5 ETH",
        color: "from-green-400 to-blue-500",
      },
      {
        name: "Nebula Rider",
        image: "https://via.placeholder.com/150/00b4d8/fff?text=Nebula+Rider",
        price: "0.7 ETH",
        color: "from-pink-500 to-purple-600",
      },
    ],
    backgrounds: [
      {
        name: "Starlight Horizon",
        image: "https://via.placeholder.com/150/800080/fff?text=Starlight+Horizon",
        price: "0.3 ETH",
        color: "from-yellow-400 to-orange-500",
      },
      {
        name: "Cosmic Dawn",
        image: "https://via.placeholder.com/150/4682b4/000?text=Cosmic+Dawn",
        price: "0.4 ETH",
        color: "from-blue-400 to-indigo-600",
      },
    ],
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

    const getPlayerName = async () => {
      const name = await contracts.SpaceWars.methods
        .getPlayerName()
        .call({ from: accounts[0] });
      setUsername(name);
    };

    getPlayerName();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 flex flex-col items-center text-white">
      <div className="text-center mt-10">
        <h1
          ref={titleRef}
          className="text-5xl md:text-6xl font-extrabold bg-clip-text text-[#6c71ff]"
        >
          {username}
        </h1>
        <p ref={subtitleRef} className="text-gray-400 mt-2 text-lg md:text-xl">
          Your collection of exclusive NFTs
        </p>
      </div>

      {/* NFT Sections */}
      <div className="mt-10 w-11/12 md:w-3/4 flex gap-8">
        {/* Owned NFTs Section */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-200 mb-7">
            Owned NFTs
          </h2>
          <div className="overflow-y-auto h-2000 space-y-4">
            {ownedNFTs.skins.map((skin, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg bg-slate-700 shadow-md flex items-center 
      relative transition-all duration-300 ease-in-out transform 
      hover:scale-105 hover:z-10 hover:shadow-xl group`}
              >
                <img
                  src={skin.image}
                  alt={skin.name}
                  className="w-24 h-24 object-cover rounded-md mr-4 
        transition-transform duration-300 group-hover:scale-110"
                />
                <div className="flex-grow">
                  <h4 className="text-lg font-bold">{skin.name}</h4>
                  <p className="mt-2 text-gray-100">{skin.price}</p>
                </div>
                <button
                  className="h-10 bg-blue-600 text-white px-5 py-1 rounded-md text-xs opacity-0 
    group-hover:opacity-100 transition-opacity duration-300 absolute right-9 bottom-5 hover:bg-blue-700"
                >
                  List to Sell
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* List to Sell Section */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-200 mb-7">
            List to Sell
          </h2>
          <div className="overflow-y-auto h-2000 space-y-4">
            {ownedNFTs.backgrounds.map((background, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg bg-slate-700 shadow-md flex items-center 
      relative transition-all duration-300 ease-in-out transform 
      hover:scale-105 hover:z-10 hover:shadow-xl group`}
              >
                <img
                  src={background.image}
                  alt={background.name}
                  className="w-24 h-24 object-cover rounded-md mr-4 
        transition-transform duration-300 group-hover:scale-110"
                />
                <div className="flex-grow">
                  <h4 className="text-lg font-bold">{background.name}</h4>
                  <p className="mt-2 text-gray-100">{background.price}</p>
                </div>
                <div className="absolute bottom-4 right-7 flex space-x-2">
                  <button
                    className="h-10 bg-blue-600 text-white px-5 py-1 rounded-md text-xs opacity-0 
    group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-700"
                  >
                    Put for sale
                  </button>
                  <button
                    className="h-10 bg-blue-600 text-white px-5 py-1 rounded-md text-xs opacity-0 
    group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-700"
                  >
                    Unlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
