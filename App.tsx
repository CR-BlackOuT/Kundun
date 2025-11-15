
import React, { useState, useEffect, useCallback } from 'react';
import { Player, LootItem, RotationState } from './types';
import { LOOT_ITEMS, INITIAL_PLAYERS } from './constants';
import LootTable from './components/LootTable';
import PlayerManager from './components/PlayerManager';
import LootAssignmentModal from './components/LootAssignmentModal';
import { HeaderIcon } from './components/icons';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rotation, setRotation] = useState<RotationState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedPlayers = localStorage.getItem('lootManager_players');
      const savedRotation = localStorage.getItem('lootManager_rotation');
      
      if (savedPlayers && savedRotation) {
        setPlayers(JSON.parse(savedPlayers));
        setRotation(JSON.parse(savedRotation));
      } else {
        // Initialize with default data if nothing is saved
        setPlayers(INITIAL_PLAYERS);
        const initialRotation: RotationState = {};
        LOOT_ITEMS.forEach(item => {
          initialRotation[item.id] = 0;
        });
        setRotation(initialRotation);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      // Fallback to initial data on error
      setPlayers(INITIAL_PLAYERS);
      const initialRotation: RotationState = {};
      LOOT_ITEMS.forEach(item => {
        initialRotation[item.id] = 0;
      });
      setRotation(initialRotation);
    }
  }, []);

  useEffect(() => {
    if (players.length > 0 || Object.keys(rotation).length > 0) {
        try {
            localStorage.setItem('lootManager_players', JSON.stringify(players));
            localStorage.setItem('lootManager_rotation', JSON.stringify(rotation));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }
  }, [players, rotation]);

  const addPlayer = (name: string) => {
    if (name && !players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      const newPlayer: Player = { id: Date.now().toString(), name };
      setPlayers(prev => [...prev, newPlayer]);
    }
  };

  const removePlayer = (id: string) => {
    const playerIndexToRemove = players.findIndex(p => p.id === id);
    if (playerIndexToRemove === -1) return;

    // Adjust rotation state before removing the player
    const newRotation: RotationState = { ...rotation };
    LOOT_ITEMS.forEach(item => {
      const currentNextIndex = rotation[item.id];
      if (currentNextIndex > playerIndexToRemove) {
        newRotation[item.id] = currentNextIndex - 1;
      } else if (currentNextIndex === playerIndexToRemove) {
        // The player being removed is next. The "next" stays at the same index,
        // which will now point to the next player in the list.
        // We need to handle the case where the last player is removed.
        const newPlayerCount = players.length - 1;
        newRotation[item.id] = playerIndexToRemove % Math.max(1, newPlayerCount);
      }
    });

    setPlayers(prev => prev.filter(p => p.id !== id));
    setRotation(newRotation);
  };

  const advanceRotation = (lootItemId: string) => {
    if (players.length === 0) return;
    setRotation(prev => ({
      ...prev,
      [lootItemId]: (prev[lootItemId] + 1) % players.length,
    }));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
        localStorage.removeItem('lootManager_players');
        localStorage.removeItem('lootManager_rotation');
        setPlayers(INITIAL_PLAYERS);
        const initialRotation: RotationState = {};
        LOOT_ITEMS.forEach(item => {
            initialRotation[item.id] = 0;
        });
        setRotation(initialRotation);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <HeaderIcon />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Guild Loot Kundun
            </h1>
          </div>
          <p className="text-gray-400 mt-2">Track boss loot and manage player rotation with ease.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Loot Rotation</h2>
            {players.length > 0 ? (
                <LootTable players={players} lootItems={LOOT_ITEMS} rotation={rotation} />
            ) : (
                <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">Add players to get started!</p>
                </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
                 <PlayerManager players={players} onAddPlayer={addPlayer} onRemovePlayer={removePlayer} />
            </div>
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Actions</h2>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={players.length === 0}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-md"
                    >
                        Boss Defeated!
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-md"
                    >
                        Reset Data
                    </button>
                </div>
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Built for the guild. May your drops be epic.</p>
        </footer>
      </div>

      <LootAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lootItems={LOOT_ITEMS}
        players={players}
        rotation={rotation}
        onAdvanceRotation={advanceRotation}
      />
    </div>
  );
};

export default App;
