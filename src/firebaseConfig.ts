// src/firebaseConfig.ts

// 1. Importar initializeApp y getFirestore (que maneja la base de datos)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- ¡Añadir esta línea!

// 2. Tu configuración (la que ya tienes)
const firebaseConfig = {
  apiKey: "AIzaSyD4AJ_R1hoQ7bu4Td6DgfM70nzZ21IryIQ", 
  authDomain: "kundun-loot.firebaseapp.com",
  projectId: "kundun-loot",
  storageBucket: "kundun-loot.appspot.com",
  messagingSenderId: "825193511314",
  appId: "1:825193511314:web:d5d58d5cbc3d3cd20c294b"
};

// 3. Inicializa Firebase (esta línea ya estaba)
const app = initializeApp(firebaseConfig);

// 4. Exporta la instancia de la base de datos (Firestore) para usarla en el resto de la app
export const db = getFirestore(app); // <-- ¡Añadir esta línea!