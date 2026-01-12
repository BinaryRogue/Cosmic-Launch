import { Planet } from './types';

export const PLANETS: Planet[] = [
  {
    name: 'Mercury',
    color: 'bg-gray-400',
    size: 'w-16 h-16',
    description: 'The Swift Messenger',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80',
    winChance: 0.70,
    multiplier: 0.05, // 5% profit
    profitLabel: '1.05x'
  },
  {
    name: 'Venus',
    color: 'bg-yellow-600',
    size: 'w-20 h-20',
    description: 'The Morning Star',
    imageUrl: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=400&q=80',
    winChance: 0.60,
    multiplier: 0.10, // 10% profit
    profitLabel: '1.10x'
  },
  {
    name: 'Earth',
    color: 'bg-blue-500',
    size: 'w-24 h-24',
    description: 'Our Home Base',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    winChance: 0.50,
    multiplier: 0.20, // 20% profit
    profitLabel: '1.20x'
  },
  {
    name: 'Mars',
    color: 'bg-red-600',
    size: 'w-18 h-18',
    description: 'The Red Planet',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80',
    winChance: 0.40,
    multiplier: 0.15, // 15% profit
    profitLabel: '1.15x'
  },
  {
    name: 'Jupiter',
    color: 'bg-orange-400',
    size: 'w-32 h-32',
    description: 'King of Planets',
    imageUrl: 'https://images.unsplash.com/photo-1630839437035-dac17da580d0?auto=format&fit=crop&w=400&q=80',
    winChance: 0.02,
    multiplier: 5.0, // 500% profit
    profitLabel: '6.00x'
  },
  {
    name: 'Saturn',
    color: 'bg-yellow-200',
    size: 'w-36 h-36',
    description: 'Lord of the Rings',
    imageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&w=400&q=80',
    winChance: 0.05,
    multiplier: 3.0, // 300% profit
    profitLabel: '4.00x'
  },
  {
    name: 'Uranus',
    color: 'bg-cyan-300',
    size: 'w-28 h-28',
    description: 'The Ice Giant',
    imageUrl: 'https://images.unsplash.com/photo-1614732484003-ef9881555dc3?auto=format&fit=crop&w=400&q=80',
    winChance: 0.10,
    multiplier: 1.5, // 150% profit
    profitLabel: '2.50x'
  },
  {
    name: 'Neptune',
    color: 'bg-blue-800',
    size: 'w-28 h-28',
    description: 'The Windy Voyager',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80',
    winChance: 0.07,
    multiplier: 2.5, // 250% profit
    profitLabel: '3.50x'
  }
];

export const NEBULA_IMAGE = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022&auto=format&fit=crop';
export const WUKONG_IMAGE = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop';