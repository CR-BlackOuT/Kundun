import React, { useState, useEffect } from 'react';
import { LootItem, Player, RotationState } from '../types';
import { SkipIcon } from './icons';

interface LootAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lootItems: LootItem[];
  players: Player[];
  rotation: RotationState;
  onAdvanceRotation: (lootItemId: string) => void;
}

const LootAssignmentModal: React.FC<LootAssignmentModalProps> = ({
  isOpen,
  onClose,
  lootItems,
  players,
  rotation,
  onAdvanceRotation,
}) => {
  const [selectedLoot, setSelectedLoot] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setSelectedLoot({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleLoot = (lootId: string) => {
    setSelectedLoot(prev => ({ ...prev, [lootId]: !prev[lootId] }));
  };

  const handleAssignSelectedLoot = () => {
    Object.keys(selectedLoot).forEach(lootId => {
      if (selectedLoot[lootId]) {
        onAdvanceRotation(lootId);
      }
    });
    onClose();
  };

  const getNextPlayerName = (lootId: string) => {
    const playerIndex = rotation[lootId];
    return players[playerIndex]?.name || 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-300">Assign Boss Loot</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-gray-400 mb-6">Select the items that dropped. To skip a player's turn (e.g., if they were absent), use the skip button <SkipIcon className="w-5 h-5 inline-block text-cyan-400"/> before selecting the item.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lootItems.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggleLoot(item.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all border-2 flex flex-col justify-between ${selectedLoot[item.id] ? 'bg-cyan-900/50 border-cyan-500' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}`}
              >
                <div className="flex items-center gap-3">
                  <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain" />
                  <h3 className="font-semibold text-white">{item.name}</h3>
                </div>
                <div className="mt-2 flex justify-between items-center">
                    <p className="text-xs text-gray-400">Next: <span className="font-bold text-green-400">{getNextPlayerName(item.id)}</span></p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdvanceRotation(item.id);
                        }}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white transition-colors"
                        title={`Skip ${getNextPlayerName(item.id)} for ${item.name}`}
                    >
                       <SkipIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 bg-gray-800/50 rounded-b-2xl flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAssignSelectedLoot}
            disabled={!Object.values(selectedLoot).some(v => v)}
            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default LootAssignmentModal;