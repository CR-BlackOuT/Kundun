import React, { useState, useEffect, useCallback } from 'react';
import { Player, LootItem, RotationState } from './types';
import { LOOT_ITEMS, INITIAL_PLAYERS } from './constants';
import LootTable from './components/LootTable';
import PlayerManager from './components/PlayerManager';
import LootAssignmentModal from './components/LootAssignmentModal';
import { HeaderIcon } from './components/icons';

// ------------------------------------------------------------------
// IMPORTACIONES DE FIREBASE
// ------------------------------------------------------------------
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from './firebase-config'; 
// ------------------------------------------------------------------

const GUILD_DATA_COLLECTION = "guildData";
const GUILD_DATA_ID = "mu_dark_epoch_loot"; // ID único para el documento

const App: React.FC = () => {
  // Inicializamos el estado vacío. El useEffect de Firebase lo llenará.
  const [players, setPlayers] = useState<Player[]>([]);
  const [rotation, setRotation] = useState<RotationState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ------------------------------------------------------------------
  // FUNCIÓN CENTRAL DE ESCRITURA: Guarda todos los datos en Firestore
  // ------------------------------------------------------------------
  const updateFirestore = useCallback(async (newPlayers: Player[], newRotation: RotationState) => {
    try {
      const docRef = doc(db, GUILD_DATA_COLLECTION, GUILD_DATA_ID);
      await setDoc(docRef, { 
        players: newPlayers, 
        rotation: newRotation 
      });
      // No necesitamos setPlayers/setRotation aquí, onSnapshot lo hará automáticamente.
    } catch (e) {
      console.error("Error writing document to Firestore: ", e);
    }
  }, []);

  // ------------------------------------------------------------------
  // EFECTO DE LECTURA: Escucha la base de datos en tiempo real (onSnapshot)
  // ------------------------------------------------------------------
  useEffect(() => {
    const docRef = doc(db, GUILD_DATA_COLLECTION, GUILD_DATA_ID);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as { players: Player[], rotation: RotationState };
        // Si hay datos en Firebase, actualiza el estado local (UI)
        setPlayers(data.players);
        setRotation(data.rotation);
      } else {
        // Si el documento NO existe (primera carga), lo creamos con datos iniciales
        console.log("No data found in Firestore, setting initial state.");
        
        const initialRotation: RotationState = {};
        LOOT_ITEMS.forEach(item => {
          initialRotation[item.id] = 0;
        });

        const initialData = {
          players: INITIAL_PLAYERS,
          rotation: initialRotation
        };

        // Guardar el estado inicial en Firebase. Esto también disparará el onSnapshot.
        setDoc(docRef, initialData).catch(e => console.error("Error setting initial data:", e));
      }
    });

    // Limpieza: Detén la escucha cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // ------------------------------------------------------------------
  // LÓGICA DE LA APLICACIÓN: USAR updateFirestore en lugar de setPlayers/setRotation
  // ------------------------------------------------------------------

  const addPlayer = (name: string) => {
    if (name && !players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      const newPlayer: Player = { id: Date.now().toString(), name };
      const newPlayers = [...players, newPlayer];
      
      // SOLO LLAMAMOS A updateFirestore
      updateFirestore(newPlayers, rotation); 
    }
  };

  const removePlayer = (id: string) => {
    const playerIndexToRemove = players.findIndex(p => p.id === id);
    if (playerIndexToRemove === -1) return;

    const newPlayers = players.filter(p => p.id !== id);
    
    // Ajuste de rotación
    const newRotation: RotationState = { ...rotation };
    LOOT_ITEMS.forEach(item => {
      const currentNextIndex = rotation[item.id];
      if (currentNextIndex > playerIndexToRemove) {
        newRotation[item.id] = currentNextIndex - 1;
      } else if (currentNextIndex === playerIndexToRemove) {
        const newPlayerCount = newPlayers.length; // Usar el array ya filtrado
        newRotation[item.id] = playerIndexToRemove % Math.max(1, newPlayerCount);
      }
    });

    // SOLO LLAMAMOS A updateFirestore
    updateFirestore(newPlayers, newRotation);
  };

  const advanceRotation = (lootItemId: string) => {
    if (players.length === 0) return;
    
    // Calcular el nuevo estado de rotación
    const newRotation: RotationState = {
      ...rotation,
      [lootItemId]: (rotation[lootItemId] + 1) % players.length,
    };
    
    // SOLO LLAMAMOS A updateFirestore
    updateFirestore(players, newRotation);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      // Calculamos el estado inicial
      const initialRotation: RotationState = {};
      LOOT_ITEMS.forEach(item => {
        initialRotation[item.id] = 0;
      });

      // GUARDAMOS EL ESTADO INICIAL EN FIREBASE
      updateFirestore(INITIAL_PLAYERS, initialRotation);
      
      // Ya no necesitamos localStorage.removeItem
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