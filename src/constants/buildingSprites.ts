import imgBarn from '../assets/images/hayday_barn_3d_1787789750575.jpg';
import imgDairy from '../assets/images/hayday_dairy_3d_1787789761282.jpg';
import imgSilo from '../assets/images/hayday_silo_3d_1787789770813.jpg';
import imgFarmhouse from '../assets/images/hayday_farmhouse_3d_1787789780438.jpg';
import imgFeedMill from '../assets/images/hayday_feedmill_3d_1787789791570.jpg';
import imgBakery from '../assets/images/hayday_bakery_3d_1787789800803.jpg';
import imgSugarMill from '../assets/images/hayday_sugarmill_3d_1787789954901.jpg';
import imgBBQGrill from '../assets/images/hayday_bbqgrill_3d_1787789967586.jpg';
import imgPopcorn from '../assets/images/hayday_popcorn_3d_1787789978581.jpg';
import imgRoadside from '../assets/images/hayday_roadside_3d_1787789989558.jpg';
import imgOrderBoard from '../assets/images/hayday_orderboard_3d_1787790011837.jpg';
import imgWheel from '../assets/images/hayday_wheel_3d_1787790024530.jpg';

// Ground & Foundation Bases
import imgGroundTile from '../assets/images/hayday_ground_tile_3d_1787790402681.jpg';
import imgDirtBase from '../assets/images/hayday_dirt_base_3d_1787790412466.jpg';
import imgCobblestoneBase from '../assets/images/hayday_cobblestone_base_3d_1787790423578.jpg';
import imgWoodBase from '../assets/images/hayday_wood_base_3d_1787790441420.jpg';

// Honey System 3D assets
import imgBeeTree from '../assets/images/hayday_beetree_3d.jpg';
import imgHoneyExtractor from '../assets/images/hayday_honeyextractor_3d.jpg';
import imgNectarBush from '../assets/images/hayday_nectarbush_3d.jpg';
import imgNectarBushWilted from '../assets/images/hayday_nectarbush_wilted_3d.jpg';
import imgDeadTree from '../assets/images/hayday_deadtree_3d.jpg';

// 3D Cartoon Boats (Hay Day style)
import imgBrokenBoat from '../assets/images/broken_boat_3d_1788552798442.jpg';
import imgRepairedBoat from '../assets/images/repaired_boat_3d_1788552810115.jpg';
import imgDeliveryBoat from '../assets/images/delivery_boat_3d_1788552822110.jpg';

// SVG Data URIs for Fishing & River System assets (fallbacks)
const svgBrokenBoat = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160">
  <defs>
    <linearGradient id="bb-hull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8D6E63"/>
      <stop offset="100%" stop-color="#4E342E"/>
    </linearGradient>
    <linearGradient id="bb-inner" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3E2723"/>
      <stop offset="100%" stop-color="#271915"/>
    </linearGradient>
  </defs>
  <!-- Hull shadow -->
  <ellipse cx="100" cy="118" rx="80" ry="24" fill="rgba(0,0,0,0.25)"/>
  <!-- Broken boat hull -->
  <path d="M 22 84 Q 50 128 100 126 Q 160 124 182 82 Q 130 96 100 96 Q 50 96 22 84 Z" fill="url(#bb-hull)" stroke="#3E2723" stroke-width="3"/>
  <!-- Inner boat cavity -->
  <path d="M 32 82 Q 60 102 100 102 Q 150 102 172 80 Q 140 70 100 70 Q 56 70 32 82 Z" fill="url(#bb-inner)"/>
  <!-- Broken planks & holes -->
  <path d="M 70 94 L 88 114 L 82 118 L 64 98 Z" fill="#2E1B15"/>
  <path d="M 120 96 L 136 112 L 130 115 L 114 98 Z" fill="#2E1B15"/>
  <circle cx="95" cy="108" r="7" fill="#1C100D"/>
  <!-- Loose wooden bench -->
  <polygon points="75,82 125,82 122,88 78,88" fill="#A1887F" stroke="#4E342E" stroke-width="1.5"/>
  <!-- Broken paddle floating/leaning -->
  <line x1="45" y1="65" x2="90" y2="110" stroke="#BCAAA4" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="43" cy="63" rx="7" ry="12" fill="#8D6E63" transform="rotate(-40 43 63)"/>
  <!-- Water puddles inside -->
  <ellipse cx="100" cy="98" rx="35" ry="6" fill="#0288D1" opacity="0.65"/>
  <!-- Patches & seaweed -->
  <path d="M 50 105 Q 56 102 62 107" stroke="#33691E" stroke-width="3" fill="none"/>
  <path d="M 140 108 Q 146 104 152 110" stroke="#558B2F" stroke-width="3" fill="none"/>
</svg>
`)}`;

const svgRepairedBoat = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160">
  <defs>
    <linearGradient id="rb-hull" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0288D1"/>
      <stop offset="100%" stop-color="#01579B"/>
    </linearGradient>
    <linearGradient id="rb-rim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="50%" stop-color="#FFD54F"/>
      <stop offset="100%" stop-color="#FFC107"/>
    </linearGradient>
    <linearGradient id="rb-deck" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D7CCC8"/>
      <stop offset="100%" stop-color="#A1887F"/>
    </linearGradient>
  </defs>
  <!-- Hull shadow -->
  <ellipse cx="100" cy="120" rx="82" ry="24" fill="rgba(0,0,0,0.25)"/>
  <!-- Main polished hull -->
  <path d="M 18 80 Q 48 132 100 130 Q 162 128 186 78 Q 134 94 100 94 Q 50 94 18 80 Z" fill="url(#rb-hull)" stroke="#01579B" stroke-width="3"/>
  <!-- White water line stripe -->
  <path d="M 28 92 Q 54 116 100 115 Q 150 114 176 89" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.9"/>
  <!-- Varnished Wood Rim -->
  <path d="M 18 80 Q 50 94 100 94 Q 150 94 186 78 Q 146 66 100 66 Q 52 66 18 80 Z" fill="url(#rb-rim)" stroke="#FFA000" stroke-width="2"/>
  <!-- Deck interior -->
  <path d="M 30 79 Q 56 89 100 89 Q 144 89 174 77 Q 138 68 100 68 Q 58 68 30 79 Z" fill="url(#rb-deck)"/>
  <!-- Solid Benches -->
  <polygon points="65,74 135,74 133,81 67,81" fill="#8D6E63" stroke="#4E342E" stroke-width="1.5"/>
  <!-- Outboard motor on back -->
  <rect x="168" y="68" width="16" height="24" rx="4" fill="#37474F" stroke="#212121" stroke-width="1.5"/>
  <rect x="172" y="90" width="8" height="18" fill="#78909C"/>
  <polygon points="170,105 182,105 176,112" fill="#B0BEC5"/>
  <!-- Fishing Rods in holders -->
  <line x1="85" y1="74" x2="50" y2="30" stroke="#FFCA28" stroke-width="3" stroke-linecap="round"/>
  <line x1="50" y1="30" x2="35" y2="45" stroke="#E0E0E0" stroke-width="1"/>
  <circle cx="35" cy="45" r="4" fill="#F44336"/>
  <!-- Life preserver ring mounted on side -->
  <circle cx="100" cy="105" r="10" fill="none" stroke="#FFFFFF" stroke-width="5"/>
  <circle cx="100" cy="105" r="10" fill="none" stroke="#F44336" stroke-width="5" stroke-dasharray="8 8"/>
</svg>
`)}`;

const svgDeliveryBoat = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" width="220" height="180">
  <defs>
    <linearGradient id="db-hull" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D32F2F"/>
      <stop offset="100%" stop-color="#8E0000"/>
    </linearGradient>
    <linearGradient id="db-cabin" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ECEFF1"/>
      <stop offset="100%" stop-color="#CFD8DC"/>
    </linearGradient>
    <linearGradient id="db-roof" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#455A64"/>
      <stop offset="100%" stop-color="#263238"/>
    </linearGradient>
  </defs>
  <!-- Hull shadow -->
  <ellipse cx="110" cy="142" rx="96" ry="26" fill="rgba(0,0,0,0.25)"/>
  <!-- Steamboat hull -->
  <path d="M 14 96 Q 50 152 115 150 Q 185 146 210 94 Q 150 110 110 110 Q 55 110 14 96 Z" fill="url(#db-hull)" stroke="#5f0909" stroke-width="3"/>
  <!-- White top stripe on hull -->
  <path d="M 14 96 Q 55 110 110 110 Q 150 110 210 94 L 208 86 Q 150 102 110 102 Q 55 102 16 88 Z" fill="#FFFFFF"/>
  <!-- Lower Deck -->
  <polygon points="30,86 195,86 190,98 35,98" fill="#8D6E63" stroke="#4E342E" stroke-width="1.5"/>
  <!-- Cargo Crates on Deck -->
  <rect x="42" y="70" width="20" height="18" rx="2" fill="#D7CCC8" stroke="#5D4037" stroke-width="1.5"/>
  <line x1="42" y1="70" x2="62" y2="88" stroke="#8D6E63" stroke-width="1"/>
  <rect x="64" y="66" width="22" height="22" rx="2" fill="#FFE082" stroke="#FF8F00" stroke-width="1.5"/>
  <line x1="64" y1="66" x2="86" y2="88" stroke="#FFA000" stroke-width="1"/>
  <!-- Main Cabin -->
  <rect x="92" y="48" width="62" height="42" rx="4" fill="url(#db-cabin)" stroke="#78909C" stroke-width="2"/>
  <!-- Windows -->
  <rect x="98" y="54" width="12" height="14" rx="2" fill="#4FC3F7" stroke="#0288D1" stroke-width="1.5"/>
  <rect x="116" y="54" width="12" height="14" rx="2" fill="#4FC3F7" stroke="#0288D1" stroke-width="1.5"/>
  <rect x="134" y="54" width="14" height="22" rx="2" fill="#37474F"/>
  <!-- Cabin Roof -->
  <polygon points="86,48 160,48 154,42 92,42" fill="url(#db-roof)" stroke="#263238" stroke-width="1.5"/>
  <!-- Smokestack Chimney -->
  <rect x="114" y="16" width="16" height="28" rx="2" fill="#D32F2F" stroke="#212121" stroke-width="1.5"/>
  <rect x="112" y="14" width="20" height="5" fill="#212121"/>
  <!-- Steam puffs -->
  <circle cx="124" cy="6" r="6" fill="#FFFFFF" opacity="0.75"/>
  <circle cx="132" cy="-4" r="8" fill="#ECEFF1" opacity="0.6"/>
  <!-- Steamboat Paddle Wheel on side -->
  <circle cx="178" cy="88" r="16" fill="#FFB300" stroke="#E65100" stroke-width="2.5"/>
  <line x1="162" y1="88" x2="194" y2="88" stroke="#BF360C" stroke-width="2"/>
  <line x1="178" y1="72" x2="178" y2="104" stroke="#BF360C" stroke-width="2"/>
  <line x1="167" y1="77" x2="189" y2="99" stroke="#BF360C" stroke-width="2"/>
  <line x1="167" y1="99" x2="189" y2="77" stroke="#BF360C" stroke-width="2"/>
  <circle cx="178" cy="88" r="6" fill="#D84315"/>
</svg>
`)}`;

export const HD_BUILDING_SPRITES = {
  farmhouse: imgFarmhouse,
  barn: imgBarn,
  silo: imgSilo,
  bakery: imgBakery,
  feed_mill: imgFeedMill,
  dairy: imgDairy,
  sugar_mill: imgSugarMill,
  bbq_grill: imgBBQGrill,
  popcorn_pot: imgPopcorn,
  roadside_shop: imgRoadside,
  order_board: imgOrderBoard,
  lucky_wheel: imgWheel,

  // Honey System
  bee_tree: imgBeeTree,
  honey_extractor: imgHoneyExtractor,
  nectar_bush: imgNectarBush,
  nectar_bush_wilted: imgNectarBushWilted,
  dead_tree: imgDeadTree,

  // Fishing System
  broken_boat: imgBrokenBoat,
  repaired_boat: imgRepairedBoat,
  delivery_boat: imgDeliveryBoat,
  lure_maker: imgWoodBase,

  // Ground Bases
  ground_tile: imgGroundTile,
  dirt_base: imgDirtBase,
  cobblestone_base: imgCobblestoneBase,
  wood_base: imgWoodBase,
};

