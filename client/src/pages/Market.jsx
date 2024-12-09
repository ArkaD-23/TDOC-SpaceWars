import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "../utilities/scrollable.css";

const skins = [
  {
    name: "Rocket Skin - Neon Blaze",
    price: "10 ETH",
    color: "from-blue-500 to-purple-500",
    image: "https://via.placeholder.com/150/00f/fff?text=Neon+Blaze",
  },
  {
    name: "Rocket Skin - Galactic Gold",
    price: "15 ETH",
    color: "from-yellow-400 to-orange-500",
    image: "https://via.placeholder.com/150/ff0/000?text=Galactic+Gold",
  },
  {
    name: "Rocket Skin - Cosmic Silver",
    price: "20 ETH",
    color: "from-gray-400 to-gray-600",
    image: "https://via.placeholder.com/150/c0c0c0/000?text=Cosmic+Silver",
  },
];

const backgrounds = [
  {
    name: "Space Background - Starlit Nebula",
    price: "8 ETH",
    color: "from-purple-600 to-pink-500",
    image: "https://via.placeholder.com/150/800080/fff?text=Starlit+Nebula",
  },
  {
    name: "Space Background - Cosmic Horizon",
    price: "12 ETH",
    color: "from-green-400 to-blue-500",
    image: "https://via.placeholder.com/150/008080/fff?text=Cosmic+Horizon",
  },
  {
    name: "Space Background - Aurora Burst",
    price: "18 ETH",
    color: "from-teal-400 to-indigo-500",
    image: "https://via.placeholder.com/150/4682b4/fff?text=Aurora+Burst",
  },
];

const Market = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const skinsRef = useRef(null);
  const backgroundsRef = useRef(null);
  const skinsItemsRef = useRef([]);
  const backgroundsItemsRef = useRef([]);
  const overlayRef = useRef(null);

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
  }, []);

  const closeOverlay = () => setSelectedItem(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 flex flex-col items-center text-white overflow-hidden">
      <h1
        ref={titleRef}
        className="text-5xl md:text-7xl font-extrabold bg-clip-text text-[#6c71ff] mt-6"
      >
        Galactic Marketplace
      </h1>
      <p ref={subtitleRef} className="text-gray-400 mt-4 text-lg md:text-xl">
        Buy exclusive rocket skins and space backgrounds for your journey!
      </p>

      {/* Skins Section */}
      <div
        ref={skinsRef}
        className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 max-h-80 overflow-y-auto scrollable-container z-10"
      >
        <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">
          Rocket Skins
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skins.map((skin, index) => (
            <div
              ref={(el) => (skinsItemsRef.current[index] = el)}
              key={skin.name}
              className={`p-4 rounded-lg bg-gradient-to-r bg-gray-500 shadow-md hover:scale-105 transform transition-transform duration-300`}
              onClick={() => setSelectedItem(skin)}
            >
              <img
                src={skin.image}
                alt={skin.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-bold">{skin.name}</h3>
              <p className="mt-2 text-gray-100">{skin.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Backgrounds Section */}
      <div
        ref={backgroundsRef}
        className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 max-h-80 overflow-y-auto scrollable-container mb-10"
      >
        <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">
          Space Backgrounds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {backgrounds.map((background, index) => (
            <div
              ref={(el) => (backgroundsItemsRef.current[index] = el)}
              key={background.name}
              className={`p-4 rounded-lg bg-gradient-to-r bg-gray-500 shadow-md hover:scale-105 transform transition-transform duration-300`}
              onClick={() => setSelectedItem(background)}
            >
              <img
                src={background.image}
                alt={background.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-bold">{background.name}</h3>
              <p className="mt-2 text-gray-100">{background.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Overlay */}
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
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <p className="text-lg font-semibold text-gray-300 mb-6">
              Price: {selectedItem.price}
            </p>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={closeOverlay}
                className="px-6 py-2 w-36 bg-red-500 rounded-lg text-white font-bold"
              >
                Close
              </button>
              <button className="px-6 py-2 w-36 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white font-bold hover:from-blue-500 hover:to-green-500 transition-all">
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
