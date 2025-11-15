
import React, { useState } from 'react';
import { Player } from '../types';

interface PlayerManagerProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
}

const PlayerManager: React.FC<PlayerManagerProps> = ({ players, onAddPlayer, onRemovePlayer }) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlayer(newPlayerName.trim());
    setNewPlayerName('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-cyan-300">Manage Players</h2>
      <form onSubmit={handleAddPlayer} className="flex gap-2">
        <input
          type="text"
          value={newPlayerName}
          onChange={e => setNewPlayerName(e.target.value)}
          placeholder="New player name"
          className="flex-grow bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
          required
        />
        <button
          type="submit"
          className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
        >
          Add
        </button>
      </form>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {players.map(player => (
          <div key={player.id} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-lg">
            <span className="text-gray-200">{player.name}</span>
            <button
              onClick={() => onRemovePlayer(player.id)}
              className="text-red-400 hover:text-red-300 font-bold p-1 rounded-full transition-colors"
              aria-label={`Remove ${player.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerManager;
