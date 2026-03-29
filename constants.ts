import { Genre, Rapper, Item } from './types';

export const RAPPERS: Rapper[] = [
  { id: 'r1', name: 'Drake', popularity: 98, featPrice: 500000, genre: Genre.MELODIC, avatar: 'https://picsum.photos/seed/drake/200' },
  { id: 'r2', name: 'Travis Scott', popularity: 95, featPrice: 350000, genre: Genre.TRAP, avatar: 'https://picsum.photos/seed/travis/200' },
  { id: 'r3', name: 'Kendrick Lamar', popularity: 96, featPrice: 400000, genre: Genre.BOOM_BAP, avatar: 'https://picsum.photos/seed/kendrick/200' },
  { id: 'r4', name: 'Central Cee', popularity: 88, featPrice: 150000, genre: Genre.DRILL, avatar: 'https://picsum.photos/seed/cee/200' },
  { id: 'r5', name: 'Lil Baby', popularity: 90, featPrice: 200000, genre: Genre.TRAP, avatar: 'https://picsum.photos/seed/baby/200' },
  { id: 'r6', name: 'Playboi Carti', popularity: 92, featPrice: 250000, genre: Genre.TRAP, avatar: 'https://picsum.photos/seed/carti/200' },
  { id: 'r7', name: 'A$AP Rocky', popularity: 89, featPrice: 180000, genre: Genre.CLOUD_RAP, avatar: 'https://picsum.photos/seed/rocky/200' },
];

export const ITEMS: Item[] = [
  { id: 'i1', name: 'Supreme Hoodie', price: 500, type: 'clothing', bonus: { hype: 5 }, image: 'https://picsum.photos/seed/supreme/200' },
  { id: 'i2', name: 'Gold Chain', price: 5000, type: 'jewelry', bonus: { charisma: 10 }, image: 'https://picsum.photos/seed/chain/200' },
  { id: 'i3', name: 'Diamond Grillz', price: 15000, type: 'jewelry', bonus: { hype: 15, charisma: 5 }, image: 'https://picsum.photos/seed/grillz/200' },
  { id: 'i4', name: 'Rolex Day-Date', price: 40000, type: 'jewelry', bonus: { hype: 20, charisma: 10 }, image: 'https://picsum.photos/seed/rolex/200' },
  { id: 'i5', name: 'Off-White Jacket', price: 2500, type: 'clothing', bonus: { hype: 10 }, image: 'https://picsum.photos/seed/offwhite/200' },
  { id: 'i6', name: 'Lamborghini Urus', price: 250000, type: 'car', bonus: { hype: 50, charisma: 20 }, image: 'https://picsum.photos/seed/urus/200' },
  { id: 'i7', name: 'Hollywood Mansion', price: 2000000, type: 'house', bonus: { hype: 100, charisma: 50 }, image: 'https://picsum.photos/seed/mansion/200' },
];

export const GRAMMY_DATE = { month: 1, day: 2 }; // February 2nd (0-indexed month 1)
