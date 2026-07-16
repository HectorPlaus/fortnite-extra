const baseSprites = [
  { id: 1, name: 'Water Sprite', rarity: 'rare', type: 'Elemental', image: 'https://static.wikia.nocookie.net/fortnite/images/a/a4/Water_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20241201124607' },
  { id: 2, name: 'Earth Sprite',  rarity: 'rare', type: 'Elemental', image: 'https://static.wikia.nocookie.net/fortnite/images/c/cf/Earth_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606121336' },
  { id: 3, name: 'Fire Sprite',  rarity: 'rare', type: 'Elemental', image: 'https://static.wikia.nocookie.net/fortnite/images/a/a4/Fire_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606121040' },
  { id: 4, name: 'Duck Sprite',rarity: 'epic', type: 'Beast', image: 'https://static.wikia.nocookie.net/fortnite/images/d/d7/Duck_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120733' },
  { id: 5, name: 'Demon Sprite', rarity: 'epic', type: 'Demon', image: 'https://static.wikia.nocookie.net/fortnite/images/9/9f/Demon_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120658' },
  { id: 6, name: 'Ghost Sprite',  rarity: 'epic', type: 'Spirit', image: 'https://static.wikia.nocookie.net/fortnite/images/6/68/Ghost_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120821' },
  { id: 7, name: 'King Sprite',rarity: 'epic', type: 'Royal', image: 'https://static.wikia.nocookie.net/fortnite/images/9/9f/King_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120900' },
  { id: 8, name: 'Punk Sprite',  rarity: 'legendary', type: 'Rebel', image: 'https://static.wikia.nocookie.net/fortnite/images/0/02/Punk_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120226' },
  { id: 9, name: 'Dream Sprite',  rarity: 'legendary', type: 'Dream', image: 'https://static.wikia.nocookie.net/fortnite/images/9/99/Dream_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606121205' },
  { id: 10, name: 'Zero Point Sprite',  rarity: 'mythic', type: 'Cosmic', image: 'https://static.wikia.nocookie.net/fortnite/images/a/a4/Zero_Point_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120116' },
  { id: 11, name: 'Burnt Peanut',  rarity: 'mythic', type: 'Mythic', image: 'https://static.wikia.nocookie.net/fortnite/images/0/0b/Burnt_Peanut_-_Item_-_Fortnite.png/revision/latest?cb=20260606183106' },
  { id: 12, name: 'Fishy Sprite',  rarity: 'rare', type: 'Fish', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Fishy_ui_L.webp'},
  { id: 13, name: 'Striker Sprite',  rarity: 'epic', type: 'Strike', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Soccer_ui_L.webp' },
  { id: 14, name: 'Aura Sprite',  rarity: 'epic', type: 'Aura', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Drifter_ui_L.webp' },
  { id: 15, name: 'Boss Sprite',  rarity: 'legendary', type: 'Boss', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Boss_ui_L.webp' },
  { id: 16, name: 'Grim Reaper Sprite',  rarity: 'mythic', type: 'Reaper', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_GrimReaper_Default_L.webp' },
  { id: 17, name: 'Aire Sprite',  rarity: 'rare', type: 'Elemental', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Air_Default_L.webp' },
  { id: 18, name: 'Seven Sprite',  rarity: 'legendary', type: 'Foundacion', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Seven_ui_L.webp' },
  { id: 19, name: 'Batman',  rarity: 'mythic', type: 'Collab', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_FossilMeal_Default_L.webp' },
  { id: 20, name: 'Vini Jr.',  rarity: 'mythic', type: 'Collab', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_CokeParmesan_Default_L.webp' },
  { id: 21, name: 'Pollo',  rarity: 'mythic', type: 'Collab', image: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_CompanyStargazer_Default_L.webp' },

  ];
//https://fortnite.gg/img/x/sprites/crown.webp

const specialTypes = ['Gold', 'Gummy', 'Galaxy', 'Holo'];

// Coloca aquí los enlaces de imagen específicos para cada base y cada tipo especial.
// Usa el ID del espíritu base como clave:
// 1 = Water Sprite, 2 = Earth Sprite, 3 = Fire Sprite, 4 = Duck Sprite, 5 = Demon Sprite,
// 6 = Ghost Sprite, 7 = King Sprite, 8 = Punk Sprite, 9 = Dream Sprite.
const specialTypeImages = {
  gold: {
    1: 'https://static.wikia.nocookie.net/fortnite/images/c/c8/Gold_Water_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    2: 'https://static.wikia.nocookie.net/fortnite/images/5/53/Gold_Earth_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606184144',
    3: 'https://static.wikia.nocookie.net/fortnite/images/9/9b/Gold_Fire_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    4: 'https://static.wikia.nocookie.net/fortnite/images/c/cc/Gold_Duck_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606183758',
    5: 'https://static.wikia.nocookie.net/fortnite/images/b/b6/Gold_Demon_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606183343',
    6: 'https://static.wikia.nocookie.net/fortnite/images/0/00/Gold_Ghost_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606184144',
    7: 'https://static.wikia.nocookie.net/fortnite/images/4/44/Gold_King_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185045',
    8: 'https://static.wikia.nocookie.net/fortnite/images/5/52/Gold_Punk_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    9: 'https://static.wikia.nocookie.net/fortnite/images/6/6e/Gold_Dream_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185045',
    10:'https://static.wikia.nocookie.net/fortnite/images/9/95/Gold_Zero_Point_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    12:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Fishy_Gold_ui_L.webp',
    13:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Soccer_Gold_L.webp',
    14:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Drifter_Gold_ui_L.webp',
    15:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Boss_Gold_ui_L.webp',
    16:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_GrimReaper_Gold_L.webp',
    17:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Air_Gold_L.webp',
    18:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Seven_Gold_ui_L.webp',
    19:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_FossilMeal_Gold_L.webp'
  },
  gummy: {
    1: 'https://static.wikia.nocookie.net/fortnite/images/7/7b/Gummy_Water_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    2: 'https://static.wikia.nocookie.net/fortnite/images/0/0e/Gummy_Earth_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606184143',
    3: 'https://static.wikia.nocookie.net/fortnite/images/d/dc/Gummy_Fire_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    4: 'https://static.wikia.nocookie.net/fortnite/images/e/ec/Gummy_Duck_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606183757',
    5: 'https://static.wikia.nocookie.net/fortnite/images/7/79/Gummy_Demon_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606183548',
    6: 'https://static.wikia.nocookie.net/fortnite/images/1/13/Gummy_Ghost_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606184145',
    7: 'https://static.wikia.nocookie.net/fortnite/images/d/d7/Gummy_King_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185044',
    8: 'https://static.wikia.nocookie.net/fortnite/images/5/5c/Gummy_Punk_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    9: 'https://static.wikia.nocookie.net/fortnite/images/d/dc/Gummy_Dream_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    10:'https://static.wikia.nocookie.net/fortnite/images/1/14/Gummy_Zero_Point_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    12: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Fishy_Candy_ui_L.webp',
    13: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Soccer_Candy_L.webp',
    14: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Drifter_Candy_ui_L.webp',
    15: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Boss_Candy_ui_L.webp',
    16: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_GrimReaper_Candy_L.webp',
    17: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Air_Candy_L.webp',
    18: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Seven_Candy_ui_L.webp',
    19:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_FossilMeal_Candy_L.webp'
  },
  galaxy: {
    1: 'https://static.wikia.nocookie.net/fortnite/images/4/43/Galaxy_Water_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    2: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Earth_Galaxy_ui_L.webp',
    3: 'https://static.wikia.nocookie.net/fortnite/images/b/bf/Galaxy_Fire_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    4: 'https://static.wikia.nocookie.net/fortnite/images/5/58/Galaxy_Duck_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606183759',
    5: 'https://static.wikia.nocookie.net/fortnite/images/a/a8/Galaxy_Demon_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606183548',
    6: 'https://static.wikia.nocookie.net/fortnite/images/2/2d/Galaxy_Ghost_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606184144',
    7: 'https://static.wikia.nocookie.net/fortnite/images/3/3f/Galaxy_King_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185045',
    8: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Punk_Galaxy_ui_L.webp',
    9: 'https://static.wikia.nocookie.net/fortnite/images/a/a2/Galaxy_Dream_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    10:'https://static.wikia.nocookie.net/fortnite/images/d/d2/Galaxy_Zero_Point_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046',
    12: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Fishy_Galaxy_ui_L.webp',
    13: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Soccer_Galaxy_L.webp',
    14: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Drifter_Galaxy_ui_L.webp',
    15: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Boss_Galaxy_ui_L.webp',
    16: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_GrimReaper_Galaxy_L.webp',
    17: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Air_Galaxy_L.webp',
    18: 'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Seven_Galaxy_ui_L.webp',
    19:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_FossilMeal_Galaxy_L.webp'
  }
  ,
  holo: {
    1:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Water_Holofoil_ui_L.webp',
    3:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Fire_Holofoil_ui_L.webp',
    6:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Ghost_Holo_L.webp',
    7:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_King_Holofoil_ui_L.webp',
    13:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Soccer_Holofoil_L.webp',
    17:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Air_Holo_L.webp',
    18:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Seven_Holofoil_ui_L.webp',
    19:'https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_FossilMeal_Holofoil_L.webp'
    }
};

function getSpecialImageByType(spriteId, type) {
  const typeKey = type.toLowerCase();
  return specialTypeImages[typeKey]?.[spriteId] || '';
}

const rarityOrder = { mythic: 0, legendary: 1, epic: 2, rare: 3, common: 4, special: 5 };
const storageKey = 'fortnite-espiritus-state';
const gridElement = document.getElementById('spiritGrid');
const resetAllButton = document.getElementById('resetAll');
const dominatedCountElement = document.getElementById('dominatedCount');
const totalSpiritsElement = document.getElementById('totalSpirits');
const registeredCountElement = document.getElementById('registeredCount');
const sortButton = document.getElementById('sortButton');
const sortMenu = document.getElementById('sortMenu');
const sortSelect = document.getElementById('sortSelect');
const spiritFilterOptions = document.getElementById('spiritFilterOptions');
const variantFilterOptions = document.getElementById('variantFilterOptions');
const densitySelect = document.getElementById('densitySelect');
const friendNameInput = document.getElementById('friendNameInput');
const addFriendButton = document.getElementById('addFriendButton');
const friendFilterOptions = document.getElementById('friendFilterOptions');
const clearFiltersButton = document.getElementById('clearFiltersButton');

let specials = [];
let spirits = [];
let friends = [];
let currentSort = 'default';
let currentDensity = 'normal';
let selectedSpirits = [];
let selectedRarities = [];
let selectedVariants = [];
let selectedStatuses = [];
let selectedFriendIds = [];
let selectedItemId = null;

function generateSpecials() {
  return baseSprites
    .filter((sprite) => sprite.id !== 11)
    .flatMap((sprite) =>
      specialTypes.flatMap((type) => {
        const typeKey = type.toLowerCase();
        const specialImage = specialTypeImages[typeKey]?.[sprite.id];
        // Sólo generar la variante si existe una imagen específica para ella
        if (!specialImage) return [];
        return {
          id: `${sprite.id}-${typeKey}`,
          name: sprite.name,
          specialType: type,
          type: sprite.type,
          rarity: sprite.rarity,
          image: specialImage,
          level: 1,
          lost: false,
          register: false,
          dominated: false
        };
      })
    );
}

function loadState() {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      friends = parsed.friends || [];
      spirits = baseSprites.map((base) => ({
        ...base,
        ...parsed.base?.[base.id],
        level: parsed.base?.[base.id]?.level ?? 1,
        lost: parsed.base?.[base.id]?.lost ?? false,
        register: parsed.base?.[base.id]?.register ?? false,
        dominated: parsed.base?.[base.id]?.dominated ?? false,
        wantedBy: parsed.base?.[base.id]?.wantedBy ?? []
      }));
      specials = generateSpecials().map((item) => ({
        ...item,
        ...parsed.special?.[item.id],
        level: parsed.special?.[item.id]?.level ?? 1,
        lost: parsed.special?.[item.id]?.lost ?? false,
        register: parsed.special?.[item.id]?.register ?? false,
        dominated: parsed.special?.[item.id]?.dominated ?? false,
        wantedBy: parsed.special?.[item.id]?.wantedBy ?? []
      }));
      currentDensity = parsed.displayDensity || currentDensity;
      return;
    } catch (error) {
      console.warn('Error al leer estado guardado:', error);
    }
  }
  spirits = baseSprites.map((base) => ({ ...base, level: 1, lost: false, register: false, dominated: false, wantedBy: [] }));
  specials = generateSpecials();
}

function saveState() {
  const payload = {
    friends,
    displayDensity: currentDensity,
    base: spirits.reduce((acc, spirit) => {
      acc[spirit.id] = {
        level: spirit.level,
        lost: spirit.lost,
        register: spirit.register,
        dominated: spirit.dominated,
        wantedBy: spirit.wantedBy || []
      };
      return acc;
    }, {}),
    special: specials.reduce((acc, spirit) => {
      acc[spirit.id] = {
        level: spirit.level,
        lost: spirit.lost,
        register: spirit.register,
        dominated: spirit.dominated,
        wantedBy: spirit.wantedBy || []
      };
      return acc;
    }, {})
  };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function getDominatedCount() {
  return [...spirits, ...specials].filter((item) => item.dominated).length;
}
function getRegisteredCount() {
  return [...spirits, ...specials].filter((item) => item.register).length;
}

function getTotalCount() {
  return spirits.length + specials.length;
}

function createCard(item) {
  const card = document.createElement('article');
  card.className = 'card';

  const header = document.createElement('div');
  header.className = 'card-header';
  const title = document.createElement('h2');
  title.className = 'visually-hidden';
  const displayName = item.name.replace(/ Sprite$/, '');
  title.textContent = displayName;
  //const cost = document.createElement('span');
  //cost.className = 'cost';
  //cost.innerHTML = `<img src="https://static.wikia.nocookie.net/fortnite/images/1/1b/Sprite_Dust_-_Icon_-_Fortnite.png/revision/latest/scale-to-width-down/25?cb=20260607135916" alt="Dust" /> ${item.cost}`;
  const badge = document.createElement('span');
  const badgeRarity = item.specialType ? item.specialType : item.rarity;
  badge.className = `badge ${item.specialType ? 'special' : item.rarity}`;
  badge.textContent = item.specialType ? item.specialType.toUpperCase() : capitalize(item.rarity);
  header.append(title, badge);

  const levelLabel = document.createElement('span');
  levelLabel.className = 'level-label';
  levelLabel.textContent = item.level;
  header.appendChild(levelLabel);

  if ((item.wantedBy || []).length > 0) {
    const friendTags = document.createElement('div');
    friendTags.className = 'friend-tags';
    item.wantedBy.forEach((friendId) => {
      const dot = document.createElement('span');
      dot.className = 'friend-dot';
      dot.style.background = getFriendColor(friendId);
      dot.title = getFriendName(friendId);
      friendTags.appendChild(dot);
    });
    header.appendChild(friendTags);
  }

  let imageWrapper;
  if (item.image) {
    imageWrapper = document.createElement('div');
    imageWrapper.className = 'card-image';
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.name;
    imageWrapper.appendChild(image);
  }

  const body = document.createElement('div');
  body.className = 'card-body';

  const lostButton = document.createElement('button');
  lostButton.type = 'button';
  lostButton.className = 'lost-btn';
  lostButton.textContent = item.lost ? 'Perdido' : 'Marcar perdido';
  lostButton.disabled = !item.register;
  lostButton.addEventListener('click', () => {
    item.lost = !item.lost;
    if (item.lost) item.level = 1;
    saveState();
    render();
  });

  const levelRow = document.createElement('div');
  levelRow.className = 'level-row';
  const minusButton = document.createElement('button');
  minusButton.className = 'control-btn';
  minusButton.textContent = '-';
  minusButton.disabled = item.level <= 1 || !item.register;
  minusButton.addEventListener('click', () => updateLevel(item.id, -1));
  const levelValue = document.createElement('div');
  levelValue.className = `level-value${item.level === 5 ? ' dominated' : ''}`;
  levelValue.textContent = item.level;
  const plusButton = document.createElement('button');
  plusButton.className = 'control-btn';
  plusButton.textContent = '+';
  plusButton.disabled = item.level >= 5;
  plusButton.addEventListener('click', () => updateLevel(item.id, 1));
  plusButton.disabled = !item.register || item.level >= 5;
  levelRow.append(minusButton, levelValue, plusButton);

  const footer = document.createElement('div');
  footer.className = 'card-footer';
  const status = document.createElement('span');
  if (!item.register) {
    status.textContent = 'No obtenido';
  } else if (item.lost && item.dominated) {
    status.textContent = 'Perdido / Dominado';
  } else if (item.dominated) {
    status.textContent = 'Dominado ✅';
  } else if (item.lost) {
    status.textContent = 'Perdido';
  } else {
    status.textContent = 'En progreso';
  }

  const registerButton = document.createElement('button');
  registerButton.type = 'button';
  registerButton.className = 'register-btn';
  registerButton.textContent = item.register ? 'Desregistrar' : 'Registrar';
  registerButton.addEventListener('click', () => {
    item.register = !item.register;
    if (!item.register) {
      item.level = 1;
      item.lost = false;
      item.dominated = false;
    }
    saveState();
    render();
  });

  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.className = 'icon-btn reset-btn';
  resetButton.title = 'Reiniciar';
  resetButton.textContent = '↺';
  resetButton.disabled = !item.register;
  resetButton.addEventListener('click', () => resetItem(item.id));
  footer.append(status, registerButton, resetButton);

  if (String(item.id) === selectedItemId) {
    const assignmentPanel = renderFriendAssignmentPanel(item);
    if (assignmentPanel) body.appendChild(assignmentPanel);
  }

  if (item.dominated) {
    const crown = document.createElement('span');
    crown.className = 'crown';
    crown.textContent = '👑';
    //header.insertBefore(crown, cost);
    header.prepend(crown);
  }
  card.append(header);
  if (imageWrapper) card.appendChild(imageWrapper);

  card.appendChild(body);
  body.append(lostButton, levelRow, footer);
  if (item.specialType) card.classList.add(`special-${item.specialType.toLowerCase()}`);
  if (!item.register) {
    card.classList.add('unregistered');
  }
  if ((item.wantedBy || []).length > 0) {
    card.classList.add('wanted');
  }
  if (String(item.id) === selectedItemId) card.classList.add('selected');

  card.addEventListener('click', (event) => {
    if (selectedItemId === String(item.id)) {
      selectedItemId = null;
    } else {
      selectedItemId = String(item.id);
    }
    render();
  });

  [lostButton, minusButton, plusButton, registerButton, resetButton].forEach((button) => {
    button.addEventListener('click', (event) => event.stopPropagation());
  });

  return card;
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.card')) {
    if (selectedItemId !== null) {
      selectedItemId = null;
      render();
    }
  }
});

function normalizeSpiritValue(name) {
  return (name || '').replace(/\s+Sprite$/i, '').trim().toLowerCase();
}

function getSelectedValues(groupName) {
  return Array.from(sortMenu.querySelectorAll(`input[type="checkbox"][data-filter-group="${groupName}"]:checked`)).map((input) => input.value);
}

function itemMatchesFilters(item) {
  const matchesSpirit = selectedSpirits.length === 0 || selectedSpirits.includes(normalizeSpiritValue(item.name));

  const matchesRarity = selectedRarities.length === 0 || selectedRarities.includes((item.rarity || '').toLowerCase());

  const matchesVariant = selectedVariants.length === 0 || selectedVariants.some((variant) => {
    if (variant === 'base') {
      return !item.specialType;
    }
    return (item.specialType || '').toLowerCase() === variant;
  });

  const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.every((status) => {
    switch (status) {
      case 'registered':
        return item.register;
      case 'notRegistered':
        return !item.register;
      case 'dominated':
        return item.dominated;
      case 'notDominated':
        return !item.dominated;
      default:
        return false;
    }
  });

  const matchesFriends = selectedFriendIds.length === 0 || selectedFriendIds.some((friendId) => (item.wantedBy || []).includes(friendId));

  return matchesSpirit && matchesRarity && matchesVariant && matchesStatus && matchesFriends;
}

function sortItems(items) {
  const filteredItems = items.filter(itemMatchesFilters);

  const sorted = [...filteredItems];

  switch (currentSort) {
    case 'rarity':
      return sorted.sort((a, b) => {
        const rankA = rarityOrder[a.rarity || 'common'];
        const rankB = rarityOrder[b.rarity || 'common'];

        if (rankA !== rankB) {
          return rankA - rankB;
        }

        return a.name.localeCompare(b.name, 'es', {
          sensitivity: 'base'
        });
      });

    case 'status':
      return sorted.sort((a, b) => {
        if (a.dominated === b.dominated) {
          return a.name.localeCompare(b.name, 'es', {
            sensitivity: 'base'
          });
        }

        return a.dominated ? -1 : 1;
      });

    case 'variant':
      return sorted.sort((a, b) => {
        const variantRank = { base: 0, gold: 1, gummy: 2, galaxy: 3, holo: 4 };
        const variantA = (a.specialType || 'base').toLowerCase();
        const variantB = (b.specialType || 'base').toLowerCase();
        const rankA = variantRank[variantA] ?? 0;
        const rankB = variantRank[variantB] ?? 0;

        if (rankA !== rankB) {
          return rankA - rankB;
        }

        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      });

    default:
      return sorted.sort((a, b) => {
        const baseIdA = String(a.id).split('-')[0];
        const baseIdB = String(b.id).split('-')[0];

        if (baseIdA !== baseIdB) {
          return Number(baseIdA) - Number(baseIdB);
        }

        if (!a.specialType && b.specialType) return -1;
        if (a.specialType && !b.specialType) return 1;

        if (a.specialType && b.specialType) {
          return specialTypes.indexOf(a.specialType) - specialTypes.indexOf(b.specialType);
        }

        return 0;
      });
  }
}

function toggleSortMenu(forceOpen) {
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : sortMenu.classList.contains('hidden');
  sortMenu.classList.toggle('hidden', !shouldOpen);
  sortButton.setAttribute('aria-expanded', String(shouldOpen));
}

function closeSortMenu() {
  sortMenu.classList.add('hidden');
  sortButton.setAttribute('aria-expanded', 'false');
}

sortButton.addEventListener('click', () => {
  toggleSortMenu();
});

document.addEventListener('click', (event) => {
  if (!sortButton.contains(event.target) && !sortMenu.contains(event.target)) {
    closeSortMenu();
  }
});

function getAllItems() {
  return [...spirits, ...specials];
}

function render() {
  gridElement.innerHTML = '';
  sortItems(getAllItems()).forEach((item) => gridElement.appendChild(createCard(item)));
  applyGridDensity();
  dominatedCountElement.textContent = `${getDominatedCount()} dominados`;
  totalSpiritsElement.textContent = `${getTotalCount()} espiritus`;
  registeredCountElement.textContent = `${getRegisteredCount()} registrados`;
  updateMenuUI();
}

function getItemById(id) {
  return String(id).includes('-') ? specials.find((item) => item.id === id) : spirits.find((item) => item.id === id);
}

function renderSpiritFilterOptions() {
  spiritFilterOptions.innerHTML = '';
  const fragment = document.createDocumentFragment();

  baseSprites.forEach((sprite) => {
    const value = normalizeSpiritValue(sprite.name);
    const label = document.createElement('label');
    label.className = 'filter-option spirit-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = value;
    checkbox.setAttribute('data-filter-group', 'spirit');

    const thumb = document.createElement('img');
    thumb.className = 'spirit-filter-thumb';
    thumb.src = sprite.image;
    thumb.alt = sprite.name;

    const name = document.createElement('span');
    name.className = 'spirit-filter-name';
    name.textContent = sprite.name.replace(/\s+Sprite$/i, '');

    label.append(checkbox, thumb, name);
    fragment.appendChild(label);
  });

  spiritFilterOptions.appendChild(fragment);
}

function renderFriendFilterOptions() {
  friendFilterOptions.innerHTML = '';
  const fragment = document.createDocumentFragment();

  if (friends.length === 0) {
    const hint = document.createElement('div');
    hint.className = 'friend-hint';
    hint.textContent = 'Agrega un amigo para filtrar por él';
    friendFilterOptions.appendChild(hint);
    return;
  }

  friends.forEach((friend) => {
    const count = getFriendCount(friend.id);
    const label = document.createElement('label');
    label.className = 'filter-option friend-filter-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = friend.id;
    checkbox.setAttribute('data-filter-group', 'friend');
    checkbox.checked = selectedFriendIds.includes(friend.id);

    const color = document.createElement('span');
    color.className = 'friend-filter-dot';
    color.style.background = friend.color;
    color.title = friend.name;

    const name = document.createElement('span');
    name.className = 'friend-filter-name';
    name.textContent = friend.name;

    const countBadge = document.createElement('span');
    countBadge.className = 'friend-count';
    countBadge.textContent = String(count);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-friend-btn';
    deleteButton.textContent = '✕';
    deleteButton.title = `Eliminar ${friend.name}`;
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      removeFriend(friend.id);
    });

    label.append(checkbox, color, name, countBadge, deleteButton);
    fragment.appendChild(label);
  });

  friendFilterOptions.appendChild(fragment);
}

function getFriendColor(friendId) {
  return friends.find((friend) => friend.id === friendId)?.color || '#ffffff';
}

function getFriendName(friendId) {
  return friends.find((friend) => friend.id === friendId)?.name || '';
}

function getFriendCount(friendId) {
  return [...spirits, ...specials].filter((item) => (item.wantedBy || []).includes(friendId)).length;
}

function removeFriend(friendId) {
  friends = friends.filter((friend) => friend.id !== friendId);
  [...spirits, ...specials].forEach((item) => {
    item.wantedBy = (item.wantedBy || []).filter((id) => id !== friendId);
  });
  selectedFriendIds = selectedFriendIds.filter((id) => id !== friendId);
  saveState();
  renderFriendFilterOptions();
  render();
}

function addFriend() {
  const name = friendNameInput.value.trim();
  if (!name) return;

  const friendId = `friend-${Date.now()}`;
  const friend = {
    id: friendId,
    name,
    color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 65%)`
  };

  friends.push(friend);
  friendNameInput.value = '';
  renderFriendFilterOptions();
  saveState();
  render();
}

function renderFriendAssignmentPanel(item) {
  if (friends.length === 0) return null;

  const panel = document.createElement('div');
  panel.className = 'friend-assignment-panel';
  panel.addEventListener('click', (event) => event.stopPropagation());

  const title = document.createElement('div');
  title.className = 'friend-assignment-title';
  title.textContent = 'Asignar a amigos';
  panel.appendChild(title);

  const list = document.createElement('div');
  list.className = 'friend-assignment-list';

  friends.forEach((friend) => {
    const label = document.createElement('label');
    label.className = 'filter-option friend-assignment-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = (item.wantedBy || []).includes(friend.id);
    checkbox.addEventListener('click', (event) => event.stopPropagation());
    checkbox.addEventListener('change', () => {
      item.wantedBy = item.wantedBy || [];
      if (checkbox.checked) {
        if (!item.wantedBy.includes(friend.id)) item.wantedBy.push(friend.id);
      } else {
        item.wantedBy = item.wantedBy.filter((id) => id !== friend.id);
      }
      saveState();
      renderFriendFilterOptions();
      render();
    });

    const color = document.createElement('span');
    color.className = 'friend-filter-dot';
    color.style.background = friend.color;
    color.title = friend.name;

    const name = document.createElement('span');
    name.textContent = friend.name;

    label.append(checkbox, color, name);
    list.appendChild(label);
  });

  panel.appendChild(list);
  return panel;
}

function renderVariantFilterOptions() {
  variantFilterOptions.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const miniatureSprite = baseSprites.find((sprite) => normalizeSpiritValue(sprite.name) === 'water');

  if (!miniatureSprite) {
    return;
  }

  const variants = [];
  // Siempre añadir la base
  variants.push({ value: 'base', image: miniatureSprite.image });
  // Añadir dinámicamente sólo las variantes que tengan imagen definida para este sprite
  specialTypes.forEach((type) => {
    const key = type.toLowerCase();
    const img = specialTypeImages[key]?.[miniatureSprite.id];
    if (img) {
      variants.push({ value: key, image: img });
    }
  });

  variants.forEach((variant) => {
    const label = document.createElement('label');
    label.className = 'filter-option variant-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = variant.value;
    checkbox.setAttribute('data-filter-group', 'variant');

    const thumb = document.createElement('img');
    thumb.className = 'variant-filter-thumb';
    thumb.src = variant.image;
    thumb.alt = `Variante ${variant.value}`;

    label.append(checkbox, thumb);
    fragment.appendChild(label);
  });

  variantFilterOptions.appendChild(fragment);
}

function updateMenuUI() {
  sortSelect.value = currentSort;
  densitySelect.value = currentDensity;
  const activeFilters = selectedSpirits.length + selectedRarities.length + selectedVariants.length + selectedStatuses.length + selectedFriendIds.length;
  const buttonLabel = activeFilters > 0 ? `Filtros y orden (${activeFilters}) ▾` : 'Filtros y orden ▾';
  sortButton.innerHTML = buttonLabel;
}

function applyGridDensity() {
  gridElement.classList.remove('density-normal', 'density-compact', 'density-dense');
  gridElement.classList.add(`density-${currentDensity}`);
}

function updateLevel(id, change) {
  const item = getItemById(id);
  if (!item) return;
  const nextLevel = Math.min(5, Math.max(1, item.level + change));
  if (item.lost && nextLevel > 1) {
    item.lost = false;
  }
  item.level = nextLevel;
  if (item.level === 5) {
    item.dominated = true;
  }
  saveState();
  render();
}

sortSelect.addEventListener('change', (event) => {
  currentSort = event.target.value;
  render();
});

densitySelect.addEventListener('change', (event) => {
  currentDensity = event.target.value;
  saveState();
  render();
});

sortMenu.addEventListener('change', () => {
  selectedSpirits = getSelectedValues('spirit');
  selectedRarities = getSelectedValues('rarity');
  selectedVariants = getSelectedValues('variant');
  selectedStatuses = getSelectedValues('status');
  selectedFriendIds = getSelectedValues('friend');
  render();
});

clearFiltersButton.addEventListener('click', () => {
  currentSort = 'default';
  selectedSpirits = [];
  selectedRarities = [];
  selectedVariants = [];
  selectedStatuses = [];
  selectedFriendIds = [];
  sortMenu.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  render();
  closeSortMenu();
});

function resetItem(id) {
  const item = getItemById(id);
  if (!item) return;
  item.level = 1;
  item.lost = false;
  item.dominated = false;
  saveState();
  render();
}

function resetAll() {
  spirits = baseSprites.map((base) => ({ ...base, level: 1, lost: false, register: false, dominated: false }));
  specials = generateSpecials();
  saveState();
  render();
}

resetAllButton.addEventListener('click', () => {
  if (confirm('¿Reiniciar todos los sprites y variantes a nivel 1?')) {
    resetAll();
  }
});



function capitalize(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

loadState();
renderSpiritFilterOptions();
renderVariantFilterOptions();
renderFriendFilterOptions();
render();

addFriendButton.addEventListener('click', addFriend);
friendNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addFriend();
  }
});
