import React, { useState, useEffect, useRef } from "react";
import spaceshipImage from "../assets/spaceship.png";
import asteroidImage from "../assets/asteroid.png";
import laserImage from "../assets/laser.png";

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [lives, setLives] = useState(3);
  const [kills, setKills] = useState(0);
  const [lasers, setLasers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [spaceshipX, setSpaceshipX] = useState(window.innerWidth / 2); // Spaceship X position
  const spaceshipRef = useRef(null);

  const startGame = () => {
    setGameStarted(true);
    setLives(3);
    setKills(0);
    setLasers([]);
    setEnemies([]);
  };

  const handleMouseMove = (e) => {
    if (!gameStarted || !spaceshipRef.current) return;
    const spaceshipWidth = spaceshipRef.current.offsetWidth;
    let x = e.pageX - spaceshipWidth / 2;

    // Constrain spaceship within bounds
    x = Math.max(0, Math.min(x, window.innerWidth - spaceshipWidth));
    setSpaceshipX(x);
  };

  const handleMouseClick = () => {
    if (!gameStarted || !spaceshipRef.current) return;
    const spaceshipWidth = spaceshipRef.current.offsetWidth;
    const x = spaceshipX + spaceshipWidth / 2 - 4; // Center of the spaceship
    const y = window.innerHeight - 100; // Just above the bottom
    setLasers((prev) => [...prev, { x, y }]);
  };

  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      const x = Math.random() * (window.innerWidth - 50); // Spawn within screen
      setEnemies((prev) => [...prev, { x, y: -50 }]);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      // Move lasers up
      setLasers((prev) =>
        prev
          .map((laser) => ({ ...laser, y: laser.y - 10 }))
          .filter((laser) => laser.y > 0)
      );

      // Move enemies down
      setEnemies((prev) =>
        prev
          .map((enemy) => ({ ...enemy, y: enemy.y + 5 }))
          .filter((enemy) => enemy.y < window.innerHeight)
      );

      // Collision detection
      setEnemies((enemies) =>
        enemies.filter((enemy) => {
          const isHit = lasers.some(
            (laser) =>
              laser.x > enemy.x &&
              laser.x < enemy.x + 50 &&
              laser.y > enemy.y &&
              laser.y < enemy.y + 50
          );
          if (isHit) {
            setKills((prev) => prev + 1);
            return false;
          }
          return true;
        })
      );

      // Detect if enemies hit the bottom
      setEnemies((prev) => {
        const remaining = prev.filter((enemy) => {
          if (enemy.y >= window.innerHeight - 50) {
            setLives((lives) => lives - 1);
            return false;
          }
          return true;
        });
        return remaining;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted, lasers]);

  useEffect(() => {
    if (lives <= 0) {
      setGameStarted(false);
    }
  }, [lives]);

  const Laser = ({ laser }) => (
    <div
      className="absolute w-4 h-4"
      style={{ left: laser.x, top: laser.y }}
    >
      <img
        src={laserImage}
        alt="asteroid"
        className="w-full h-full object-contain"
      />
    </div>
  );

  const Asteroid = ({ enemy }) => (
    <div className="absolute w-12 h-12" style={{ left: enemy.x, top: enemy.y }}>
      <img
        src={asteroidImage}
        alt="asteroid"
        className="w-full h-full object-contain"
      />
    </div>
  );

  const Spaceship = () => (
    <div
      id="spaceship"
      ref={spaceshipRef}
      className="absolute bottom-12 w-10 h-12"
      style={{ left: spaceshipX, bottom: "4.5rem" }}
    >
      <img
        src={spaceshipImage}
        alt="Spaceship"
        className="w-full h-full object-contain"
      />
    </div>
  );

  return (
    <div
      id="space"
      className={`relative w-full h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 overflow-hidden ${gameStarted ? "cursor-none" : ""
        }`}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
    >
      {!gameStarted && (
        <>
          <div className="absolute top-1/3 left-20">
            <h1
              className="text-[#b19aef] text-7xl font-bold mb-4"
            >
              Enter The Journey
            </h1>
            <br></br>
            <p className="text-[#ffffff] text-xl mb-2">
              Brace yourself for an epic space adventure.
            </p>
            <p className="text-[#ffffff] text-xl mb-6">
              Dodge asteroids, destroy enemies, and claim victory.
            </p>
            <button
              id="start"
              className="bg-[#b19aef] text-[#000000]  text-2xl px-20 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300"
              onClick={startGame}
            >
            START GAME
            </button>
          </div>
        </>
      )}

      {gameStarted && (
        <>
          <h1
            id="killCount"
            className="absolute top-2 left-2 text-green-500 text-4xl"
          >
            Kills: {kills}
          </h1>
          <h1
            id="livesCount"
            className="absolute top-2 right-2 text-red-500 text-4xl"
          >
            Lives: {lives}
          </h1>

          <Spaceship />

          {lasers.map((laser, index) => (
            <Laser key={index} laser={laser} />
          ))}

          {enemies.map((enemy, index) => (
            <Asteroid key={index} enemy={enemy} />
          ))}
        </>
      )}
    </div>
  );
};

export default Game;
