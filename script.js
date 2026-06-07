const baseSprites = [
  { id: 1, name: 'Water Sprite', cost: 100, rarity: 'rare', image: 'https://static.wikia.nocookie.net/fortnite/images/a/a4/Water_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20241201124607' },
  { id: 2, name: 'Earth Sprite', cost: 100, rarity: 'rare', image: 'https://static.wikia.nocookie.net/fortnite/images/c/cf/Earth_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606121336' },
  { id: 3, name: 'Fire Sprite', cost: 100, rarity: 'rare', image: 'https://static.wikia.nocookie.net/fortnite/images/a/a4/Fire_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606121040' },
  { id: 4, name: 'Duck Sprite', cost: 3000, rarity: 'epic', image: 'https://static.wikia.nocookie.net/fortnite/images/d/d7/Duck_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120733' },
  { id: 5, name: 'Demon Sprite', cost: 3000, rarity: 'epic', image: 'https://static.wikia.nocookie.net/fortnite/images/9/9f/Demon_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120658' },
  { id: 6, name: 'Ghost Sprite', cost: 3000, rarity: 'epic', image: 'https://static.wikia.nocookie.net/fortnite/images/6/68/Ghost_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120821' },
  { id: 7, name: 'King Sprite', cost: 3000, rarity: 'epic', image: 'https://static.wikia.nocookie.net/fortnite/images/9/9f/King_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120900' },
  { id: 8, name: 'Punk Sprite', cost: 5000, rarity: 'legendary', image: 'https://static.wikia.nocookie.net/fortnite/images/0/02/Punk_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120226' },
  { id: 9, name: 'Dream Sprite', cost: 5000, rarity: 'legendary', image: 'https://static.wikia.nocookie.net/fortnite/images/9/99/Dream_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606121205' },
  { id: 10, name: 'Burnt Peanut', cost: 7500, rarity: 'mythic', image: 'https://static.wikia.nocookie.net/fortnite/images/0/0b/Burnt_Peanut_-_Item_-_Fortnite.png/revision/latest?cb=20260606183106' },
  { id: 11, name: 'Zero Point Sprite', cost: 7500, rarity: 'mythic', image: 'https://static.wikia.nocookie.net/fortnite/images/a/a4/Zero_Point_Sprite_-_Item_-_Fortnite.png/revision/latest?cb=20260606120116' }
];

const specialTypes = ['Gold', 'Gummy', 'Galaxy', 'Special'];
const storageKey = 'fortnite-espiritus-state';
const gridElement = document.getElementById('spiritGrid');
const variantGridElement = document.getElementById('variantGrid');
const resetAllButton = document.getElementById('resetAll');
const dominatedCountElement = document.getElementById('dominatedCount');
const totalSpiritsElement = document.getElementById('totalSpirits');

let spirits = [];
let specials = [];

function generateSpecials() {
  return baseSprites
    .filter((sprite) => sprite.id !== 10)
    .flatMap((sprite) =>
      specialTypes.map((type) => ({
        id: `${sprite.id}-${type.toLowerCase()}`,
        name: sprite.name,
        specialType: type,
        cost: sprite.cost,
        rarity: sprite.rarity,
        image: sprite.image,
        level: 1,
        lost: false,
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
        dominated: parsed.base?.[base.id]?.dominated ?? false
      }));
      specials = generateSpecials().map((item) => ({
        ...item,
        ...parsed.special?.[item.id],
        level: parsed.special?.[item.id]?.level ?? 1,
        lost: parsed.special?.[item.id]?.lost ?? false,
        dominated: parsed.special?.[item.id]?.dominated ?? false
      }));
      return;
    } catch (error) {
      console.warn('Error al leer estado guardado:', error);
    }
  }
  spirits = baseSprites.map((base) => ({ ...base, level: 1, lost: false, dominated: false }));
  specials = generateSpecials();
}

function saveState() {
  const payload = {
    base: spirits.reduce((acc, spirit) => {
      acc[spirit.id] = {
        level: spirit.level,
        lost: spirit.lost,
        dominated: spirit.dominated
      };
      return acc;
    }, {}),
    special: specials.reduce((acc, spirit) => {
      acc[spirit.id] = {
        level: spirit.level,
        lost: spirit.lost,
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

function getTotalCount() {
  return spirits.length + specials.length;
}

function createCard(item) {
  const card = document.createElement('article');
  card.className = 'card';

  const header = document.createElement('div');
  header.className = 'card-header';
  const title = document.createElement('h2');
  const displayName = item.name.replace(/ Sprite$/, '');
  title.textContent = item.specialType ? `${displayName} (${item.specialType})` : displayName;
  const cost = document.createElement('span');
  cost.className = 'cost';
  cost.innerHTML = `<img src="https://static.wikia.nocookie.net/fortnite/images/1/1b/Sprite_Dust_-_Icon_-_Fortnite.png/revision/latest/scale-to-width-down/25?cb=20260607135916" alt="Dust" /> ${item.cost}`;
  const badge = document.createElement('span');
  const badgeRarity = item.specialType ? 'special' : item.rarity;
  badge.className = `badge ${badgeRarity}`;
  badge.textContent = item.specialType ? 'Special' : capitalize(item.rarity);
  header.append(title, cost, badge);

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
  minusButton.disabled = item.level <= 1;
  minusButton.addEventListener('click', () => updateLevel(item.id, -1, item.specialType ? 'special' : 'base'));
  const levelValue = document.createElement('div');
  levelValue.className = `level-value${item.level === 5 ? ' dominated' : ''}`;
  levelValue.textContent = `Nivel ${item.level}`;
  const plusButton = document.createElement('button');
  plusButton.className = 'control-btn';
  plusButton.textContent = '+';
  plusButton.disabled = item.level >= 5;
  plusButton.addEventListener('click', () => updateLevel(item.id, 1, item.specialType ? 'special' : 'base'));
  levelRow.append(minusButton, levelValue, plusButton);

  const footer = document.createElement('div');
  footer.className = 'card-footer';
  const status = document.createElement('span');
  if (item.lost && item.dominated) {
    status.textContent = 'Perdido / Dominado';
  } else if (item.dominated) {
    status.textContent = 'Dominado ✅';
  } else if (item.lost) {
    status.textContent = 'Perdido';
  } else {
    status.textContent = 'En progreso';
  }
  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.className = 'icon-btn reset-btn';
  resetButton.title = 'Reiniciar';
  resetButton.textContent = '↺';
  resetButton.addEventListener('click', () => resetItem(item.id, item.specialType ? 'special' : 'base'));
  footer.append(status, resetButton);

  if (item.dominated) {
    const crown = document.createElement('span');
    crown.className = 'crown';
    crown.textContent = '👑';
    header.insertBefore(crown, cost);
  }
  card.append(header);
  if (imageWrapper) card.appendChild(imageWrapper);
  card.appendChild(body);
  body.append(lostButton, levelRow, footer);
  if (item.specialType) card.classList.add(`special-${item.specialType.toLowerCase()}`);
  return card;
}

function render() {
  gridElement.innerHTML = '';
  variantGridElement.innerHTML = '';
  spirits.forEach((spirit) => gridElement.appendChild(createCard(spirit)));
  specials.forEach((special) => variantGridElement.appendChild(createCard(special)));
  dominatedCountElement.textContent = `${getDominatedCount()} dominados`;
  totalSpiritsElement.textContent = `${getTotalCount()} sprites`;
}

function getItemById(type, id) {
  return type === 'special' ? specials.find((item) => item.id === id) : spirits.find((item) => item.id === id);
}

function updateLevel(id, change, type) {
  const item = getItemById(type, id);
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

function resetItem(id, type) {
  const item = getItemById(type, id);
  if (!item) return;
  item.level = 1;
  item.lost = false;
  item.dominated = false;
  saveState();
  render();
}

function resetAll() {
  spirits = baseSprites.map((base) => ({ ...base, level: 1, lost: false, dominated: false }));
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
render();
