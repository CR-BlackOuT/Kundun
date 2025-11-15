import { ReactElement } from 'react';

export interface Player {
  id: string;
  name: string;
}

export interface LootItem {
  id: string;
  name: string;
  icon: string; // Changed from ReactElement to string for image URLs
}

export interface RotationState {
  [lootItemId: string]: number; // value is the index of the player in the players array
}