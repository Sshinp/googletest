export enum Genre {
  TRAP = 'Trap',
  BOOM_BAP = 'Boom Bap',
  MELODIC = 'Melodic',
  DRILL = 'Drill',
  CLOUD_RAP = 'Cloud Rap'
}

export interface Rapper {
  id: string;
  name: string;
  popularity: number; // 0-100
  featPrice: number;
  genre: Genre;
  avatar: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  type: 'clothing' | 'jewelry' | 'car' | 'house';
  bonus: {
    hype?: number;
    charisma?: number;
    skill?: number;
  };
  image: string;
}

export interface Track {
  id: string;
  title: string;
  genre: Genre;
  featId?: string;
  releaseDate: Date;
  streams: number;
  revenue: number;
  quality: number; // 0-100
  hype: number; // 0-100
}

export interface GameState {
  playerName: string;
  money: number;
  fame: number;
  skill: number;
  charisma: number;
  hype: number;
  currentDate: Date;
  inventory: string[]; // item IDs
  tracks: Track[];
  awards: string[]; // e.g., "Grammy 2026"
  isGameOver: boolean;
}
