export const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const generateForestForParcel = (parcel: { x: number; y: number; width: number; height: number; id: string }) => {
  const items: { x: number; y: number; type: 'pine' | 'oak' | 'rock' | 'bush' }[] = [];
  const seedBase = parcel.x * 100 + parcel.y;
  
  // Fill the parcel area with trees
  for (let dy = 0; dy < parcel.height; dy++) {
    for (let dx = 0; dx < parcel.width; dx++) {
      const tileSeed = seedBase + dx * 10 + dy;
      const rand = pseudoRandom(tileSeed);
      
      if (rand > 0.4) {
        let type: 'pine' | 'oak' | 'rock' | 'bush' = 'pine';
        if (rand > 0.85) type = 'oak';
        else if (rand > 0.75) type = 'rock';
        else if (rand > 0.65) type = 'bush';
        
        items.push({
          x: parcel.x + dx + pseudoRandom(tileSeed + 1) * 0.8 + 0.1,
          y: parcel.y + dy + pseudoRandom(tileSeed + 2) * 0.8 + 0.1,
          type
        });
      }
    }
  }
  
  // Sort items back-to-front (isometric depth)
  return items.sort((a, b) => (a.x + a.y) - (b.x + b.y));
};
