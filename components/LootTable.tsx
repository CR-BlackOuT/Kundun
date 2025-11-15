import React from 'react';
import { Player, LootItem, RotationState } from '../types';

interface LootTableProps {
  players: Player[];
  lootItems: LootItem[];
  rotation: RotationState;
}

const LootTable: React.FC<LootTableProps> = ({ players, lootItems, rotation }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-cyan-300 uppercase bg-gray-700/50">
          <tr>
            <th scope="col" className="px-6 py-3 sticky left-0 bg-gray-700/50 z-10">
              Player
            </th>
            {lootItems.map(item => (
              <th key={item.id} scope="col" className="px-6 py-3 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                    <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain" />
                    <span>{item.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player, playerIndex) => (
            <tr key={player.id} className="bg-gray-800/80 border-b border-gray-700 hover:bg-gray-700/80">
              <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white sticky left-0 bg-gray-800/80 z-10">
                {player.name}
              </th>
              {lootItems.map(item => (
                <td key={item.id} className="px-6 py-4 text-center">
                  {rotation[item.id] === playerIndex && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      NEXT
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LootTable;