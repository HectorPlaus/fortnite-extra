const baseSprites = [
  { id: 1, name: 'Water Sprite', cost: 100, rarity: 'rare', type: 'Elemental', image: 'https://static.wikia.nocookie.net/fortnite/images/a/a4/Water_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20241201124607' },
  { id: 2, name: 'Earth Sprite', cost: 100, rarity: 'rare', type: 'Elemental', image: 'https://static.wikia.nocookie.net/fortnite/images/c/cf/Earth_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606121336' },
  { id: 3, name: 'Fire Sprite', cost: 100, rarity: 'rare', type: 'Elemental', image: 'https://static.wikia.nocookie.net/fortnite/images/a/a4/Fire_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606121040' },
  { id: 4, name: 'Duck Sprite', cost: 3000, rarity: 'epic', type: 'Beast', image: 'https://static.wikia.nocookie.net/fortnite/images/d/d7/Duck_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120733' },
  { id: 5, name: 'Demon Sprite', cost: 3000, rarity: 'epic', type: 'Demon', image: 'https://static.wikia.nocookie.net/fortnite/images/9/9f/Demon_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120658' },
  { id: 6, name: 'Ghost Sprite', cost: 3000, rarity: 'epic', type: 'Spirit', image: 'https://static.wikia.nocookie.net/fortnite/images/6/68/Ghost_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120821' },
  { id: 7, name: 'King Sprite', cost: 3000, rarity: 'epic', type: 'Royal', image: 'https://static.wikia.nocookie.net/fortnite/images/9/9f/King_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120900' },
  { id: 8, name: 'Punk Sprite', cost: 5000, rarity: 'legendary', type: 'Rebel', image: 'https://static.wikia.nocookie.net/fortnite/images/0/02/Punk_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120226' },
  { id: 9, name: 'Dream Sprite', cost: 5000, rarity: 'legendary', type: 'Dream', image: 'https://static.wikia.nocookie.net/fortnite/images/9/99/Dream_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606121205' },
  { id: 10, name: 'Burnt Peanut', cost: 7500, rarity: 'mythic', type: 'Mythic', image: 'https://static.wikia.nocookie.net/fortnite/images/0/0b/Burnt_Peanut_-_Item_-_Fortnite.png/revision/latest?cb=20260606183106' },
  { id: 11, name: 'Zero Point Sprite', cost: 7500, rarity: 'mythic', type: 'Cosmic', image: 'https://static.wikia.nocookie.net/fortnite/images/a/a4/Zero_Point_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120116' }
];
//https://fortnite.gg/img/x/sprites/crown.webp

const specialTypes = ['Gold', 'Gummy', 'Galaxy'];

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
    11:'https://static.wikia.nocookie.net/fortnite/images/9/95/Gold_Zero_Point_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046'
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
    11:'https://static.wikia.nocookie.net/fortnite/images/1/14/Gummy_Zero_Point_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046'
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
    11:'https://static.wikia.nocookie.net/fortnite/images/d/d2/Galaxy_Zero_Point_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606185046'
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
const sortSelect = document.getElementById('sortSelect');

let spirits = [];
let specials = [];
let currentSort = 'default';
let selectedItemId = null;

function generateSpecials() {
  return baseSprites
    .filter((sprite) => sprite.id !== 10)
    .flatMap((sprite) =>
      specialTypes.map((type) => ({
        id: `${sprite.id}-${type.toLowerCase()}`,
        name: sprite.name,
        specialType: type,
        type: sprite.type,
        cost: sprite.cost,
        rarity: sprite.rarity,
        image: getSpecialImageByType(sprite.id, type) || sprite.image,
        level: 1,
        lost: false,
        register: false,
        dominated: false
      }))
    );
}

function loadState() {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      spirits = baseSprites.map((base) => ({
        ...base,
        ...parsed.base?.[base.id],
        level: parsed.base?.[base.id]?.level ?? 1,
        lost: parsed.base?.[base.id]?.lost ?? false,
        register: parsed.base?.[base.id]?.register ?? false,
        dominated: parsed.base?.[base.id]?.dominated ?? false
      }));
      specials = generateSpecials().map((item) => ({
        ...item,
        ...parsed.special?.[item.id],
        level: parsed.special?.[item.id]?.level ?? 1,
        lost: parsed.special?.[item.id]?.lost ?? false,
        register: parsed.special?.[item.id]?.register ?? false,
        dominated: parsed.special?.[item.id]?.dominated ?? false
      }));
      return;
    } catch (error) {
      console.warn('Error al leer estado guardado:', error);
    }
  }
  spirits = baseSprites.map((base) => ({ ...base, level: 1, lost: false, register: false, dominated: false }));
  specials = generateSpecials();
}

function saveState() {
  const payload = {
    base: spirits.reduce((acc, spirit) => {
      acc[spirit.id] = {
        level: spirit.level,
        lost: spirit.lost,
        register: spirit.register,
        dominated: spirit.dominated
      };
      return acc;
    }, {}),
    special: specials.reduce((acc, spirit) => {
      acc[spirit.id] = {
        level: spirit.level,
        lost: spirit.lost,
        register: spirit.register,
        dominated: spirit.dominated
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
  const cost = document.createElement('span');
  cost.className = 'cost';
  cost.innerHTML = `<img src="https://static.wikia.nocookie.net/fortnite/images/1/1b/Sprite_Dust_-_Icon_-_Fortnite.png/revision/latest/scale-to-width-down/25?cb=20260607135916" alt="Dust" /> ${item.cost}`;
  const badge = document.createElement('span');
  const badgeRarity = item.specialType ? item.specialType : item.rarity;
  badge.className = `badge ${item.specialType ? 'special' : item.rarity}`;
  badge.textContent = item.specialType ? item.specialType.toUpperCase() : capitalize(item.rarity);
  header.append(title, cost, badge);

  const levelLabel = document.createElement('span');
  levelLabel.className = 'level-label';
  levelLabel.textContent = `Niv. ${item.level}`;
  header.appendChild(levelLabel);

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
  levelValue.textContent = `Nivel ${item.level}`;
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

  if (item.dominated) {
    const crown = document.createElement('span');
    crown.className = 'crown';
    crown.textContent = '👑';
    header.insertBefore(crown, cost);
  }
  card.append(header);
  if (imageWrapper) card.appendChild(imageWrapper);

  const hint = document.createElement('div');
  hint.className = 'card-hint';
  hint.textContent = 'Haz clic para editar';
  card.appendChild(hint);

  card.appendChild(body);
  body.append(lostButton, levelRow, footer);
  if (item.specialType) card.classList.add(`special-${item.specialType.toLowerCase()}`);
  if (!item.register) {
    card.classList.add('unregistered');
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

function sortItems(items) {
  const sorted = [...items];
  const filteredItems = currentSort === 'registered' ? sorted.filter((item) => item.register) : sorted;
  
  if (currentSort === 'rarity') {
    return filteredItems.sort((a, b) => {
      const rankA = rarityOrder[a.rarity || 'common'];
      const rankB = rarityOrder[b.rarity || 'common'];
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    });
  }

  if (currentSort === 'status') {
    return filteredItems.sort((a, b) => {
      if (a.dominated === b.dominated) {
        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      }
      return a.dominated ? -1 : 1;
    });
  }
  return filteredItems.sort((a, b) => {
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

function getAllItems() {
  return [...spirits, ...specials];
}

function render() {
  gridElement.innerHTML = '';
  sortSelect.value = currentSort;
  sortItems(getAllItems()).forEach((item) => gridElement.appendChild(createCard(item)));
  dominatedCountElement.textContent = `${getDominatedCount()} dominados`;
  totalSpiritsElement.textContent = `${getTotalCount()} espiritus`;
  registeredCountElement.textContent = `${getRegisteredCount()} registrados`;
}

function getItemById(id) {
  return String(id).includes('-') ? specials.find((item) => item.id === id) : spirits.find((item) => item.id === id);
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

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  render();
});

function capitalize(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

loadState();
render();
