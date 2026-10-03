(() => {
  const catalogUrl = 'https://fortnite-api.com/v2/cosmetics/br?language=es';
  const shopUrl = 'https://fortnite-api.com/v2/shop?language=es';
  const collectionsKey = 'fortnite-espiritus-collections';
  const activeTabKey = 'fortnite-espiritus-active-tab';
  const pageSize = 72;
  const catalogGrid = document.getElementById('cosmeticGrid');
  const cosmeticTypeOptions = document.getElementById('cosmeticTypeOptions');
  const cosmeticTypeSummary = document.getElementById('cosmeticTypeSummary');
  const selectedCosmeticTypes = new Set();
  const bulkAddCosmeticsButton = document.getElementById('addFilteredCosmeticsButton');
  const bulkAddMessage = document.getElementById('bulkAddMessage');
  const collectionGrid = document.getElementById('collectionGrid');
  const catalogMessage = document.getElementById('catalogMessage');
  const collectionMessage = document.getElementById('collectionMessage');
  const collectionStorageMessage = document.getElementById('collectionStorageMessage');
  const catalogCount = document.getElementById('catalogCount');
  const collectionPicker = document.getElementById('collectionPicker');
  const catalogView = document.getElementById('cosmeticsCatalogView');
  const collectionView = document.getElementById('collectionView');
  const spiritsTab = document.getElementById('spiritsTab');
  const cosmeticsTab = document.getElementById('cosmeticsTab');
  const shopTab = document.getElementById('shopTab');
  const appTabs = [spiritsTab, cosmeticsTab, shopTab];
  const shopView = document.getElementById('shopView');
  const shopGrid = document.getElementById('shopGrid');
  const shopMessage = document.getElementById('shopMessage');
  const shopCount = document.getElementById('shopCount');
  const shopDateElement = document.getElementById('shopDate');
  const shopCategoryFilter = document.getElementById('shopCategoryFilter');
  const loadMoreShopButton = document.getElementById('loadMoreShopOffers');
  const loadMoreCosmeticsButton = document.getElementById('loadMoreCosmetics');
  const loadMoreCollectionButton = document.getElementById('loadMoreCollectionItems');

  if (!catalogGrid || !collectionGrid || !collectionPicker) return;

  let cosmetics = [];
  let requestPromise = null;
  let catalogLimit = pageSize;
  let collectionLimit = pageSize;
  let selectedCollectionId = '';
  let storageLocked = false;
  let collectionData = readCollections();
  let searchTimer;
  let catalogLoadStarted = false;
  let shopEntries = [];
  let shopRequestPromise = null;
  let shopLoaded = false;
  let shopLoadFailed = false;
  let shopLimit = pageSize;
  let shopDateValue = '';
  let vbuckIcon = '';
  let shopPricesById = new Map();
  let shopSearchTimer;
  let activeDetailCosmetic = null;

  function showStorageMessage(message) {
    collectionStorageMessage.textContent = message;
    collectionStorageMessage.hidden = !message;
    collectionStorageMessage.classList.toggle('catalog-error', Boolean(message));
  }

  function readCollections() {
    try {
      const stored = localStorage.getItem(collectionsKey);
      if (stored === null) return [];

      const parsed = JSON.parse(stored);
      const isValid = parsed && parsed.version === 1 && Array.isArray(parsed.collections)
        && parsed.collections.every((collection) => collection
          && typeof collection.id === 'string'
          && typeof collection.name === 'string'
          && Array.isArray(collection.items)
          && collection.items.every((item) => item && typeof item.id === 'string'));

      if (!isValid) throw new Error('Unsupported collection data');

      return parsed.collections.map((collection) => ({
        id: collection.id,
        name: collection.name,
        items: collection.items.map((item) => ({
          id: item.id,
          name: typeof item.name === 'string' ? item.name : item.id,
          type: typeof item.type === 'string' ? item.type : 'Sin tipo',
          image: typeof item.image === 'string' ? item.image : ''
        }))
      }));
    } catch {
      storageLocked = true;
      showStorageMessage('No se pudieron interpretar las colecciones guardadas. Se conservaron los datos y la edición está desactivada para evitar sobrescribirlos.');
      return [];
    }
  }

  function saveCollections(nextCollections) {
    if (storageLocked) return false;
    try {
      localStorage.setItem(collectionsKey, JSON.stringify({ version: 1, collections: nextCollections }));
      collectionData = nextCollections;
      return true;
    } catch {
      storageLocked = true;
      showStorageMessage('No se pudieron guardar las colecciones en este navegador. La edición se ha desactivado.');
      refreshCollectionControls();
      return false;
    }
  }

  function getSelectedCollection() {
    return collectionData.find((collection) => collection.id === selectedCollectionId) || null;
  }

  function refreshCollectionControls() {
    const previousId = selectedCollectionId;
    collectionPicker.replaceChildren();

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = collectionData.length ? 'Selecciona colección' : 'Sin colecciones';
    collectionPicker.appendChild(placeholder);

    collectionData.forEach((collection) => {
      const option = document.createElement('option');
      option.value = collection.id;
      option.textContent = collection.name;
      collectionPicker.appendChild(option);
    });

    selectedCollectionId = collectionData.some((collection) => collection.id === previousId)
      ? previousId
      : (collectionData[0]?.id || '');
    collectionPicker.value = selectedCollectionId;

    const hasSelection = Boolean(getSelectedCollection());
    const canEdit = !storageLocked;
    document.getElementById('renameCollectionButton').disabled = !hasSelection || !canEdit;
    document.getElementById('renameCollectionName').disabled = !hasSelection || !canEdit;
    document.getElementById('deleteCollectionButton').disabled = !hasSelection || !canEdit;
    document.getElementById('viewCollectionButton').disabled = !hasSelection;
    document.getElementById('createCollectionForm').querySelector('button').disabled = !canEdit;
    document.getElementById('newCollectionName').disabled = !canEdit;
    bulkAddCosmeticsButton.disabled = !hasSelection || !canEdit
      || Number(bulkAddCosmeticsButton.dataset.addableCount || 0) === 0;
    collectionPicker.disabled = collectionData.length === 0;
    catalogGrid.querySelectorAll('[data-collection-action]').forEach((button) => {
      button.disabled = !hasSelection || !canEdit;
    });
  }

  function createId() {
    return globalThis.crypto?.randomUUID?.()
      || `collection-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function createOption(value, label) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    return option;
  }

  function populateFilter(selectId, values, defaultLabel) {
    const select = document.getElementById(selectId);
    select.replaceChildren(createOption('', defaultLabel));
    [...values.entries()]
      .sort((first, second) => first[1].localeCompare(second[1], 'es'))
      .forEach(([value, label]) => select.appendChild(createOption(value, label)));
  }

  function updateCosmeticTypeSummary() {
    const selectedLabels = [...selectedCosmeticTypes]
      .map((value) => cosmeticTypeLabels.get(value))
      .filter(Boolean);
    if (!selectedLabels.length) {
      cosmeticTypeSummary.textContent = 'Tipos: todos';
    } else if (selectedLabels.length <= 2) {
      cosmeticTypeSummary.textContent = `Tipos: ${selectedLabels.join(', ')}`;
    } else {
      cosmeticTypeSummary.textContent = `Tipos: ${selectedLabels.length} seleccionados`;
    }
  }

  let cosmeticTypeLabels = new Map();

  function populateCosmeticTypeFilter(values) {
    cosmeticTypeLabels = values;
    [...selectedCosmeticTypes].forEach((value) => {
      if (!values.has(value)) selectedCosmeticTypes.delete(value);
    });
    cosmeticTypeOptions.replaceChildren();

    [...values.entries()]
      .sort((first, second) => first[1].localeCompare(second[1], 'es'))
      .forEach(([value, labelText]) => {
        const label = document.createElement('label');
        label.className = 'catalog-type-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value;
        checkbox.checked = selectedCosmeticTypes.has(value);
        const text = document.createElement('span');
        text.textContent = labelText;
        label.append(checkbox, text);
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) selectedCosmeticTypes.add(value);
          else selectedCosmeticTypes.delete(value);
          updateCosmeticTypeSummary();
          catalogLimit = pageSize;
          renderCatalog();
        });
        cosmeticTypeOptions.appendChild(label);
      });

    updateCosmeticTypeSummary();
  }

  function normalizeCosmetic(item) {
    const typeValue = item.type?.value || item.type?.displayValue || 'unknown';
    const typeLabel = [item.type?.displayValue, item.type?.value]
      .find((value) => typeof value === 'string' && value.trim() && value.toLocaleLowerCase('es') !== 'null')
      || 'Sin tipo';
    return {
      id: String(item.id),
      name: typeof item.name === 'string' && item.name ? item.name : String(item.id),
      typeValue: String(typeValue),
      typeCode: item.type?.backendValue || '',
      typeLabel,
      rarityValue: item.rarity?.value || '',
      rarityCode: item.rarity?.backendValue || '',
      rarityLabel: item.rarity?.displayValue || item.rarity?.value || '',
      setValue: item.set?.value || '',
      setCode: item.set?.backendValue || '',
      description: item.description || '',
      seriesLabel: item.series?.value || '',
      seriesCode: item.series?.backendValue || '',
      seriesColors: Array.isArray(item.series?.colors) ? item.series.colors : [],
      setDescription: item.set?.text || '',
      introduction: item.introduction?.text || '',
      chapter: item.introduction?.chapter || '',
      season: item.introduction?.season || '',
      addedAt: typeof item.added === 'string' && Number.isFinite(Date.parse(item.added))
        ? Date.parse(item.added)
        : null,
      image: item.images?.icon || item.images?.smallIcon || item.images?.featured || '',
      images: item.images && typeof item.images === 'object' ? item.images : {},
      variants: Array.isArray(item.variants) ? item.variants : []
    };
  }

  function requestCatalog() {
    if (!requestPromise) {
      requestPromise = fetch(catalogUrl)
        .then((response) => {
          if (!response.ok) throw new Error('Catalog request failed');
          return response.json();
        })
        .then((payload) => {
          if (!payload || payload.status !== 200 || !Array.isArray(payload.data) || payload.data.length === 0) {
            throw new Error('Catalog response was empty or invalid');
          }

          cosmetics = payload.data
            .filter((item) => item && typeof item.id === 'string')
            .map(normalizeCosmetic);
          if (!cosmetics.length) throw new Error('Catalog contained no usable items');
          return cosmetics;
        });
    }
    return requestPromise;
  }

  function showCatalogError() {
    catalogMessage.textContent = 'No se pudo cargar el catálogo. Comprueba tu conexión e inténtalo de nuevo.';
    catalogMessage.classList.add('catalog-error');
    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = 'Reintentar';
    retryButton.addEventListener('click', loadCatalog);
    catalogMessage.append(' ', retryButton);
    catalogCount.textContent = '';
  }

  async function loadCatalog() {
    catalogMessage.classList.remove('catalog-error');
    catalogMessage.textContent = 'Cargando cosméticos…';
    catalogGrid.replaceChildren();
    loadMoreCosmeticsButton.hidden = true;
    try {
      await requestCatalog();
      const types = new Map();
      const rarities = new Map();
      const sets = new Map();
      cosmetics.forEach((cosmetic) => {
        if (!types.has(cosmetic.typeValue)) types.set(cosmetic.typeValue, cosmetic.typeLabel);
        if (cosmetic.rarityValue && !rarities.has(cosmetic.rarityValue)) {
          rarities.set(cosmetic.rarityValue, cosmetic.rarityLabel);
        }
        if (cosmetic.setValue && !sets.has(cosmetic.setValue)) sets.set(cosmetic.setValue, cosmetic.setValue);
      });
      populateCosmeticTypeFilter(types);
      populateFilter('cosmeticSetFilter', sets, 'Todos');
      populateFilter('cosmeticRarityFilter', rarities, 'Todas');
      catalogMessage.textContent = '';
      renderCatalog();
    } catch {
      requestPromise = null;
      showCatalogError();
    }
  }

  function getPrice(value) {
    if (value === null || value === undefined || value === '') return null;
    const price = Number(value);
    return Number.isFinite(price) && price >= 0 ? price : null;
  }

  function buildShopPriceIndex(entries) {
    shopPricesById = new Map();
    entries.forEach((entry) => {
      const items = [...new Map((entry.brItems || []).filter((item) => item && item.id)
        .map((item) => [String(item.id), item])).values()];
      const offer = {
        name: entry.bundle?.name || (items.length === 1 ? items[0].name : entry.layout?.name) || 'Oferta de tienda',
        category: entry.layout?.category || entry.layout?.name || '',
        bundleName: entry.bundle?.name || '',
        itemCount: items.length,
        regularPrice: getPrice(entry.regularPrice),
        finalPrice: getPrice(entry.finalPrice),
        outDate: entry.outDate || ''
      };
      items.forEach((item) => {
        const offers = shopPricesById.get(String(item.id)) || [];
        offers.push(offer);
        shopPricesById.set(String(item.id), offers);
      });
    });
  }

  function ensureShopData() {
    if (shopLoaded) return Promise.resolve();
    if (!shopRequestPromise) {
      shopRequestPromise = fetch(shopUrl)
        .then((response) => {
          if (!response.ok) throw new Error('Shop request failed');
          return response.json();
        })
        .then((payload) => {
          if (!payload || payload.status !== 200 || !Array.isArray(payload.data?.entries)) {
            throw new Error('Shop response was invalid');
          }
          shopEntries = payload.data.entries.filter((entry) => Array.isArray(entry.brItems));
          shopDateValue = typeof payload.data.date === 'string' ? payload.data.date : '';
          vbuckIcon = typeof payload.data.vbuckIcon === 'string' ? payload.data.vbuckIcon : '';
          buildShopPriceIndex(shopEntries);
          shopLoaded = true;
          shopLoadFailed = false;
        })
        .catch((error) => {
          shopRequestPromise = null;
          shopLoaded = false;
          shopLoadFailed = true;
          throw error;
        });
    }
    return shopRequestPromise;
  }

  function makeShopPriceNode(price, className = 'shop-price') {
    const node = document.createElement('span');
    node.className = className;
    if (price === null) {
      node.textContent = 'Precio no disponible';
      return node;
    }
    if (vbuckIcon) {
      const icon = document.createElement('img');
      icon.src = vbuckIcon;
      icon.alt = '';
      icon.className = 'vbuck-icon';
      node.appendChild(icon);
    }
    node.append(`${price.toLocaleString('es')} paVos`);
    return node;
  }

  function renderCosmeticShopPrices(cosmetic, container) {
    container.replaceChildren();
    const heading = document.createElement('h3');
    heading.textContent = 'Precio en la tienda actual';
    container.appendChild(heading);

    if (!shopLoaded) {
      const message = document.createElement('p');
      message.className = 'catalog-message';
      message.textContent = shopLoadFailed ? 'No se pudo consultar la tienda.' : 'Consultando la tienda actual…';
      container.appendChild(message);
      if (shopLoadFailed) {
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.textContent = 'Reintentar';
        retry.addEventListener('click', () => loadShop(true));
        container.appendChild(retry);
      }
      return;
    }

    const offers = shopPricesById.get(String(cosmetic.id)) || [];
    if (!offers.length) {
      const message = document.createElement('p');
      message.className = 'catalog-message';
      message.textContent = 'Este cosmético no aparece en las ofertas actuales.';
      container.appendChild(message);
      return;
    }

    offers.forEach((offer) => {
      const row = document.createElement('div');
      row.className = 'cosmetic-detail-price-entry';
      const offerName = document.createElement('strong');
      offerName.textContent = offer.name;
      const priceLine = document.createElement('div');
      priceLine.className = 'cosmetic-detail-price-line';
      if (offer.bundleName) {
        const qualifier = document.createElement('span');
        qualifier.textContent = `Incluido en el lote${offer.itemCount > 1 ? ` de ${offer.itemCount} cosméticos` : ''}:`;
        priceLine.appendChild(qualifier);
      } else if (offer.itemCount > 1) {
        const qualifier = document.createElement('span');
        qualifier.textContent = `Precio de la oferta con ${offer.itemCount} cosméticos:`;
        priceLine.appendChild(qualifier);
      } else {
        const qualifier = document.createElement('span');
        qualifier.textContent = 'Precio individual:';
        priceLine.appendChild(qualifier);
      }
      priceLine.appendChild(makeShopPriceNode(offer.finalPrice));

      if (offer.regularPrice !== null && offer.finalPrice !== null && offer.regularPrice > offer.finalPrice) {
        priceLine.appendChild(makeShopPriceNode(offer.regularPrice, 'shop-regular-price'));
      }

      const validUntil = document.createElement('span');
      validUntil.className = 'shop-valid-until';
      if (offer.outDate && Number.isFinite(Date.parse(offer.outDate))) {
        validUntil.textContent = `Disponible hasta ${new Date(offer.outDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}`;
      }
      row.append(offerName, priceLine);
      if (validUntil.textContent) row.appendChild(validUntil);
      container.appendChild(row);
    });
  }

  async function loadShop(force = false) {
    if (force) {
      shopLoaded = false;
      shopRequestPromise = null;
    }
    if (shopLoaded) {
      if (!shopView.hidden) renderShop();
      updateOpenCosmeticShopPrice();
      return;
    }

    shopMessage.classList.remove('catalog-error');
    shopMessage.textContent = 'Cargando ofertas actuales…';
    updateOpenCosmeticShopPrice();
    try {
      await ensureShopData();
      shopMessage.textContent = '';
      shopLoadFailed = false;
      if (!shopView.hidden) renderShop();
      updateOpenCosmeticShopPrice();
    } catch {
      shopLoadFailed = true;
      shopMessage.replaceChildren();
      shopMessage.classList.add('catalog-error');
      shopMessage.append('No se pudo cargar la tienda. Comprueba tu conexión e inténtalo de nuevo. ');
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Reintentar';
      retry.addEventListener('click', () => loadShop(true));
      shopMessage.appendChild(retry);
      shopCount.textContent = '';
      shopGrid.replaceChildren();
      loadMoreShopButton.hidden = true;
      updateOpenCosmeticShopPrice();
    }
  }

  function getShopOfferName(entry) {
    if (entry.bundle?.name) return entry.bundle.name;
    if (entry.brItems?.length === 1) return entry.brItems[0].name;
    return entry.layout?.name || entry.layout?.category || 'Oferta de tienda';
  }

  function getShopOfferImage(entry) {
    const renders = entry.newDisplayAsset?.renderImages;
    return renders?.find((image) => image.productTag === 'Product.BR' && image.image)?.image
      || renders?.find((image) => image.image)?.image
      || entry.bundle?.image
      || entry.brItems?.[0]?.images?.featured
      || entry.brItems?.[0]?.images?.icon
      || '';
  }

  function getFilteredShopEntries() {
    const query = document.getElementById('shopSearch').value.trim().toLocaleLowerCase('es');
    const category = shopCategoryFilter.value;
    const sort = document.getElementById('shopSort').value;
    const getTimestamp = (value) => {
      const timestamp = Date.parse(value);
      return Number.isFinite(timestamp) ? timestamp : null;
    };
    const compareDate = (firstValue, secondValue, newestFirst) => {
      const firstDate = getTimestamp(firstValue);
      const secondDate = getTimestamp(secondValue);
      if (firstDate === null) return secondDate === null ? 0 : 1;
      if (secondDate === null) return -1;
      return newestFirst ? secondDate - firstDate : firstDate - secondDate;
    };
    const comparePrice = (first, second, highestFirst) => {
      const firstPrice = getPrice(first.finalPrice);
      const secondPrice = getPrice(second.finalPrice);
      if (firstPrice === null) return secondPrice === null ? 0 : 1;
      if (secondPrice === null) return -1;
      return highestFirst ? secondPrice - firstPrice : firstPrice - secondPrice;
    };
    const getDiscount = (entry) => {
      const regularPrice = getPrice(entry.regularPrice);
      const finalPrice = getPrice(entry.finalPrice);
      return regularPrice === null || finalPrice === null ? null : Math.max(0, regularPrice - finalPrice);
    };
    const entries = shopEntries.filter((entry) => {
      const categoryLabel = entry.layout?.category || entry.layout?.name || 'Otros';
      const names = (entry.brItems || []).map((item) => item.name || '').join(' ');
      const searchable = `${getShopOfferName(entry)} ${categoryLabel} ${names}`.toLocaleLowerCase('es');
      return (!query || searchable.includes(query)) && (!category || categoryLabel === category);
    });
    if (sort === 'price-asc') entries.sort((first, second) => comparePrice(first, second, false));
    if (sort === 'price-desc') entries.sort((first, second) => comparePrice(first, second, true));
    if (sort === 'name') entries.sort((first, second) => getShopOfferName(first).localeCompare(getShopOfferName(second), 'es'));
    if (sort === 'ending-soon') entries.sort((first, second) => compareDate(first.outDate, second.outDate, false));
    if (sort === 'newest') entries.sort((first, second) => compareDate(first.inDate, second.inDate, true));
    if (sort === 'discount') entries.sort((first, second) => {
      const firstDiscount = getDiscount(first);
      const secondDiscount = getDiscount(second);
      if (firstDiscount === null) return secondDiscount === null ? 0 : 1;
      if (secondDiscount === null) return -1;
      return secondDiscount - firstDiscount;
    });
    if (sort === 'category') entries.sort((first, second) => {
      const firstCategory = first.layout?.category || first.layout?.name || 'Otros';
      const secondCategory = second.layout?.category || second.layout?.name || 'Otros';
      return firstCategory.localeCompare(secondCategory, 'es');
    });
    if (sort === 'bundles') entries.sort((first, second) => {
      const firstIsBundle = Boolean(first.bundle) || new Set((first.brItems || []).map((item) => item.id).filter(Boolean)).size > 1;
      const secondIsBundle = Boolean(second.bundle) || new Set((second.brItems || []).map((item) => item.id).filter(Boolean)).size > 1;
      return Number(secondIsBundle) - Number(firstIsBundle);
    });
    return entries;
  }

  function createShopOfferCard(entry) {
    const card = document.createElement('article');
    card.className = 'shop-offer-card';
    const imageUrl = getShopOfferImage(entry);
    if (imageUrl) {
      const image = document.createElement('img');
      image.className = 'shop-offer-image';
      image.src = imageUrl;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => image.replaceWith(makeNoImage()), { once: true });
      card.appendChild(image);
    } else {
      card.appendChild(makeNoImage());
    }

    const content = document.createElement('div');
    content.className = 'shop-offer-content';
    const category = document.createElement('p');
    category.className = 'shop-offer-category';
    category.textContent = entry.layout?.category || entry.layout?.name || 'Oferta';
    const heading = document.createElement('h3');
    heading.textContent = getShopOfferName(entry);
    const price = document.createElement('div');
    price.className = 'shop-offer-prices';
    price.appendChild(makeShopPriceNode(getPrice(entry.finalPrice)));
    const regularPrice = getPrice(entry.regularPrice);
    const finalPrice = getPrice(entry.finalPrice);
    if (regularPrice !== null && finalPrice !== null && regularPrice > finalPrice) {
      price.appendChild(makeShopPriceNode(regularPrice, 'shop-regular-price'));
    }

    const itemList = document.createElement('div');
    itemList.className = 'shop-offer-items';
    const items = [...new Map((entry.brItems || []).filter((item) => item && item.id)
      .map((item) => [String(item.id), item])).values()];
    items.slice(0, 4).forEach((item) => {
      const itemButton = document.createElement('button');
      itemButton.type = 'button';
      itemButton.className = 'shop-item-link';
      itemButton.textContent = item.name || item.id;
      itemButton.addEventListener('click', () => {
        const cosmetic = cosmetics.find((candidate) => candidate.id === String(item.id)) || normalizeCosmetic(item);
        openCosmeticDetail(cosmetic);
      });
      itemList.appendChild(itemButton);
    });
    if (items.length > 4) {
      const remaining = document.createElement('span');
      remaining.className = 'shop-remaining-items';
      remaining.textContent = `y ${items.length - 4} más`;
      itemList.appendChild(remaining);
    }

    const validUntil = document.createElement('p');
    validUntil.className = 'shop-valid-until';
    if (entry.outDate && Number.isFinite(Date.parse(entry.outDate))) {
      validUntil.textContent = `Hasta ${new Date(entry.outDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' })}`;
    }

    content.append(category, heading, price);
    if (itemList.childElementCount) content.appendChild(itemList);
    if (validUntil.textContent) content.appendChild(validUntil);
    card.appendChild(content);
    return card;
  }

  function renderShop() {
    if (!shopLoaded) return;
    const categories = new Map();
    shopEntries.forEach((entry) => {
      const value = entry.layout?.category || entry.layout?.name || 'Otros';
      if (!categories.has(value)) categories.set(value, value);
    });
    const selectedCategory = shopCategoryFilter.value;
    populateFilter('shopCategoryFilter', categories, 'Todas');
    shopCategoryFilter.value = selectedCategory;

    const entries = getFilteredShopEntries();
    const fragment = document.createDocumentFragment();
    entries.slice(0, shopLimit).forEach((entry) => fragment.appendChild(createShopOfferCard(entry)));
    shopGrid.replaceChildren(fragment);
    shopCount.textContent = `${entries.length.toLocaleString('es')} ofertas`;
    shopDateElement.textContent = shopDateValue
      ? `Actualizada: ${new Date(shopDateValue).toLocaleDateString('es-ES', { dateStyle: 'long', timeZone: 'UTC' })}`
      : '';
    shopMessage.classList.remove('catalog-error');
    shopMessage.textContent = entries.length ? '' : 'No hay ofertas que coincidan con la búsqueda.';
    loadMoreShopButton.hidden = entries.length <= shopLimit;
  }

  function updateOpenCosmeticShopPrice() {
    const dialog = document.getElementById('cosmeticDetailDialog');
    const section = document.getElementById('cosmeticShopPriceSection');
    if (!dialog.open || !section) return;
    const cosmetic = activeDetailCosmetic;
    if (cosmetic) renderCosmeticShopPrices(cosmetic, section);
  }

  function makeNoImage() {
    const fallback = document.createElement('div');
    fallback.className = 'cosmetic-no-image';
    fallback.textContent = 'Imagen no disponible';
    return fallback;
  }

  function appendDetailMetadata(list, label, value) {
    if (value === undefined || value === null || value === '') return;
    const item = document.createElement('div');
    item.className = 'cosmetic-detail-meta';
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = value;
    item.append(term, description);
    list.appendChild(item);
  }

  function collectImageAssets(value, path = []) {
    const assetLabels = {
      smallIcon: 'Icono pequeño',
      icon: 'Icono',
      featured: 'Imagen destacada',
      lego: 'LEGO',
      bean: 'Figura Bean',
      other: 'Otros',
      background: 'Fondo',
      small: 'Pequeña',
      large: 'Grande',
      wide: 'Panorámica'
    };
    if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
      return [{ label: path.map((part) => assetLabels[part] || part.replace(/([A-Z])/g, ' $1')).join(' · '), url: value }];
    }
    if (!value || typeof value !== 'object') return [];
    return Object.entries(value).flatMap(([key, child]) => collectImageAssets(child, [...path, key]));
  }

  function selectDetailImage(asset, selection) {
    selection.selectedUrl = asset.url;
    selection.selectedLabel = asset.label;
    selection.image.src = asset.url;
    selection.image.alt = `${asset.label} de ${selection.cosmeticName}`;
    selection.image.hidden = false;
    selection.fallback.hidden = true;
    selection.caption.textContent = asset.label;
    selection.buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.assetUrl === asset.url));
    });
  }

  function createDetailImageChoice(asset, selection, className, imageClassName) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.assetUrl = asset.url;
    button.setAttribute('aria-label', `Mostrar ${asset.label} de ${selection.cosmeticName}`);
    button.setAttribute('aria-pressed', String(selection.selectedUrl === asset.url));

    const image = document.createElement('img');
    image.className = imageClassName;
    image.src = asset.url;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      image.replaceWith(makeNoImage());
      button.disabled = true;
    }, { once: true });
    const caption = document.createElement('figcaption');
    caption.textContent = asset.label;
    button.append(image, caption);
    button.addEventListener('click', () => selectDetailImage(asset, selection));
    selection.buttons.push(button);
    return button;
  }

  function openCosmeticDetail(cosmetic) {
    const dialog = document.getElementById('cosmeticDetailDialog');
    const title = document.getElementById('cosmeticDetailTitle');
    const content = document.getElementById('cosmeticDetailContent');
    activeDetailCosmetic = cosmetic;
    dialog.dataset.cosmeticId = String(cosmetic.id);
    title.textContent = cosmetic.name;
    content.replaceChildren();

    const imageAssets = collectImageAssets(cosmetic.images);
    const variantAssets = cosmetic.variants.flatMap((variant) => (Array.isArray(variant.options) ? variant.options : [])
      .filter((option) => typeof option.image === 'string' && option.image)
      .map((option) => ({
        label: [option.name || option.tag || 'Variante', variant.type, variant.channel].filter(Boolean).join(' · '),
        url: option.image
      })));
    const initialImage = imageAssets.find((asset) => asset.label === 'Icono') || imageAssets[0] || variantAssets[0];
    const imageSelection = {
      cosmeticName: cosmetic.name,
      image: document.createElement('img'),
      fallback: makeNoImage(),
      caption: document.createElement('figcaption'),
      buttons: [],
      selectedUrl: initialImage?.url || '',
      selectedLabel: initialImage?.label || ''
    };

    if (initialImage) {
      const previewSection = document.createElement('section');
      previewSection.className = 'cosmetic-detail-section cosmetic-detail-preview-section';
      const previewHeading = document.createElement('h3');
      previewHeading.textContent = 'Vista previa';
      const preview = document.createElement('figure');
      preview.className = 'cosmetic-detail-preview';
      imageSelection.image.className = 'cosmetic-detail-preview-image';
      imageSelection.image.alt = `${initialImage.label} de ${cosmetic.name}`;
      imageSelection.image.loading = 'eager';
      imageSelection.image.decoding = 'async';
      imageSelection.image.src = initialImage.url;
      imageSelection.fallback.classList.add('cosmetic-detail-preview-fallback');
      imageSelection.fallback.hidden = true;
      imageSelection.image.addEventListener('error', () => {
        if (imageSelection.image.getAttribute('src') !== imageSelection.selectedUrl) return;
        imageSelection.image.hidden = true;
        imageSelection.fallback.textContent = `No se pudo cargar: ${imageSelection.selectedLabel}`;
        imageSelection.fallback.hidden = false;
      });
      imageSelection.caption.className = 'cosmetic-detail-preview-caption';
      imageSelection.caption.textContent = initialImage.label;
      preview.append(imageSelection.image, imageSelection.fallback, imageSelection.caption);
      previewSection.append(previewHeading, preview);
      content.appendChild(previewSection);
    }

    if (cosmetic.description) {
      const description = document.createElement('p');
      description.className = 'cosmetic-detail-description';
      description.textContent = cosmetic.description;
      content.appendChild(description);
    }

    const metadata = document.createElement('dl');
    metadata.className = 'cosmetic-detail-metadata';
    appendDetailMetadata(metadata, 'Tipo', cosmetic.typeLabel || cosmetic.type);
    appendDetailMetadata(metadata, 'Código de tipo', cosmetic.typeValue);
    appendDetailMetadata(metadata, 'Código interno de tipo', cosmetic.typeCode);
    appendDetailMetadata(metadata, 'Rareza', cosmetic.rarityLabel);
    appendDetailMetadata(metadata, 'Código interno de rareza', cosmetic.rarityCode);
    appendDetailMetadata(metadata, 'Serie', cosmetic.seriesLabel);
    appendDetailMetadata(metadata, 'Código interno de serie', cosmetic.seriesCode);
    appendDetailMetadata(metadata, 'Conjunto', cosmetic.setValue);
    appendDetailMetadata(metadata, 'Código interno del conjunto', cosmetic.setCode);
    appendDetailMetadata(metadata, 'Descripción del conjunto', cosmetic.setDescription);
    if (cosmetic.chapter || cosmetic.season) {
      appendDetailMetadata(metadata, 'Capítulo y temporada', [cosmetic.chapter && `Capítulo ${cosmetic.chapter}`, cosmetic.season && `Temporada ${cosmetic.season}`].filter(Boolean).join(' · '));
    }
    appendDetailMetadata(metadata, 'Introducción', cosmetic.introduction);
    appendDetailMetadata(metadata, 'Añadido a la API', cosmetic.addedAt === null
      ? ''
      : new Date(cosmetic.addedAt).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' }));
    appendDetailMetadata(metadata, 'ID', cosmetic.id);
    if (metadata.childElementCount) content.appendChild(metadata);

    const priceSection = document.createElement('section');
    priceSection.id = 'cosmeticShopPriceSection';
    priceSection.className = 'cosmetic-detail-section cosmetic-detail-shop-price';
    content.appendChild(priceSection);
    renderCosmeticShopPrices(cosmetic, priceSection);

    if (cosmetic.seriesColors.length) {
      const colorSection = document.createElement('section');
      colorSection.className = 'cosmetic-detail-section';
      const heading = document.createElement('h3');
      heading.textContent = 'Colores de la serie';
      const swatches = document.createElement('div');
      swatches.className = 'cosmetic-detail-colors';
      cosmetic.seriesColors.forEach((color) => {
        if (!/^[\da-f]{6,8}$/i.test(color)) return;
        const swatch = document.createElement('span');
        swatch.className = 'cosmetic-detail-color';
        swatch.style.backgroundColor = `#${color}`;
        swatch.title = `#${color}`;
        swatch.setAttribute('aria-label', `Color #${color}`);
        swatches.appendChild(swatch);
      });
      if (swatches.childElementCount) {
        colorSection.append(heading, swatches);
        content.appendChild(colorSection);
      }
    }

    if (imageAssets.length) {
      const assetSection = document.createElement('section');
      assetSection.className = 'cosmetic-detail-section';
      const heading = document.createElement('h3');
      heading.textContent = 'Selecciona una imagen';
      const gallery = document.createElement('div');
      gallery.className = 'cosmetic-detail-gallery';
      imageAssets.forEach((asset) => gallery.appendChild(createDetailImageChoice(
        asset,
        imageSelection,
        'cosmetic-detail-image-choice',
        'cosmetic-detail-thumbnail'
      )));
      assetSection.append(heading, gallery);
      content.appendChild(assetSection);
    }

    cosmetic.variants.forEach((variant) => {
      const variantSection = document.createElement('section');
      variantSection.className = 'cosmetic-detail-section';
      const heading = document.createElement('h3');
      heading.textContent = [variant.type, variant.channel].filter(Boolean).join(' · ') || 'Variantes';
      const options = document.createElement('div');
      options.className = 'cosmetic-detail-variants';
      (Array.isArray(variant.options) ? variant.options : []).forEach((option) => {
        const entry = document.createElement('article');
        entry.className = 'cosmetic-detail-variant';
        if (typeof option.image === 'string' && option.image) {
          const optionImage = createDetailImageChoice({
            label: option.name || option.tag || 'Variante',
            url: option.image
          }, imageSelection, 'cosmetic-detail-variant-choice', 'cosmetic-detail-variant-thumbnail');
          entry.appendChild(optionImage);
        } else {
          const name = document.createElement('strong');
          name.textContent = option.name || option.tag || 'Opción';
          entry.appendChild(name);
        }
        if (option.tag && option.name && option.tag !== option.name) {
          const tag = document.createElement('span');
          tag.textContent = option.tag;
          entry.appendChild(tag);
        }
        options.appendChild(entry);
      });
      if (options.childElementCount) {
        variantSection.append(heading, options);
        content.appendChild(variantSection);
      }
    });

    if (!content.childElementCount) {
      const unavailable = document.createElement('p');
      unavailable.className = 'catalog-message';
      unavailable.textContent = 'La API no proporciona más detalles para este cosmético.';
      content.appendChild(unavailable);
    }

    if (!dialog.open) dialog.showModal();
    if (!shopLoaded) loadShop();
  }

  function makeCosmeticCard(cosmetic, inCollection, collectionIndex = 0, collectionLength = 0) {
    const card = document.createElement('article');
    card.className = 'cosmetic-card cosmetic-card-clickable';
    card.tabIndex = 0;
    card.setAttribute('aria-label', `Abrir detalle de ${cosmetic.name}`);
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      openCosmeticDetail(cosmetic);
    });
    card.addEventListener('keydown', (event) => {
      if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      openCosmeticDetail(cosmetic);
    });

    if (cosmetic.image) {
      const image = document.createElement('img');
      image.className = 'cosmetic-card-image';
      image.src = cosmetic.image;
      image.alt = cosmetic.name;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => image.replaceWith(makeNoImage()), { once: true });
      card.appendChild(image);
    } else {
      card.appendChild(makeNoImage());
    }

    const content = document.createElement('div');
    content.className = 'cosmetic-card-content';
    const name = document.createElement('h4');
    name.textContent = cosmetic.name;
    const type = document.createElement('p');
    type.className = 'cosmetic-card-type';
    type.textContent = cosmetic.typeLabel || cosmetic.type || 'Sin tipo';
    content.append(name, type);

    if (!inCollection) {
      const collection = getSelectedCollection();
      const alreadyAdded = collection?.items.some((item) => item.id === cosmetic.id) || false;
      const action = document.createElement('button');
      action.type = 'button';
      action.dataset.collectionAction = 'true';
      action.disabled = storageLocked || !collection;
      action.textContent = alreadyAdded ? 'Quitar' : 'Añadir';
      action.setAttribute('aria-label', `${alreadyAdded ? 'Quitar de' : 'Añadir a'} ${collection?.name || 'una colección'}: ${cosmetic.name}`);
      action.addEventListener('click', () => toggleCosmeticInCollection(cosmetic));
      content.appendChild(action);
    } else {
      card.classList.add('collection-item-card');
      const reorderControls = document.createElement('div');
      reorderControls.className = 'collection-reorder-controls';
      [
        { direction: -1, label: 'Mover arriba', symbol: '↑' },
        { direction: 1, label: 'Mover abajo', symbol: '↓' }
      ].forEach(({ direction, label, symbol }) => {
        const moveButton = document.createElement('button');
        moveButton.type = 'button';
        moveButton.className = 'collection-reorder-button';
        moveButton.textContent = symbol;
        moveButton.title = `${label} en la colección`;
        moveButton.setAttribute('aria-label', `${label} ${cosmetic.name} en la colección`);
        moveButton.disabled = storageLocked
          || collectionIndex + direction < 0
          || collectionIndex + direction >= collectionLength;
        moveButton.addEventListener('click', () => moveCosmeticInCollection(cosmetic.id, direction));
        reorderControls.appendChild(moveButton);
      });
      content.appendChild(reorderControls);

      const action = document.createElement('button');
      action.type = 'button';
      action.className = 'collection-remove-button';
      action.textContent = '×';
      action.title = 'Quitar de la colección';
      action.setAttribute('aria-label', `Quitar ${cosmetic.name} de la colección`);
      action.disabled = storageLocked;
      action.addEventListener('click', () => removeCosmeticFromCollection(cosmetic.id));
      content.appendChild(action);
    }

    card.appendChild(content);
    return card;
  }

  function getFilteredCosmetics() {
    const query = document.getElementById('cosmeticSearch').value.trim().toLocaleLowerCase('es');
    const set = document.getElementById('cosmeticSetFilter').value;
    const rarity = document.getElementById('cosmeticRarityFilter').value;
    const sortMode = document.getElementById('cosmeticSort').value;
    const compareName = (first, second) => first.name.localeCompare(second.name, 'es');
    const rarityOrder = {
      common: 0,
      uncommon: 1,
      rare: 2,
      epic: 3,
      legendary: 4,
      mythic: 5
    };
    const compareRarity = (first, second) => {
      const rankDifference = (rarityOrder[first.rarityValue] ?? 6) - (rarityOrder[second.rarityValue] ?? 6);
      return rankDifference || first.rarityLabel.localeCompare(second.rarityLabel, 'es') || compareName(first, second);
    };
    const compareAdded = (first, second, newestFirst) => {
      if (first.addedAt === null) return second.addedAt === null ? compareName(first, second) : 1;
      if (second.addedAt === null) return -1;
      return (newestFirst ? second.addedAt - first.addedAt : first.addedAt - second.addedAt)
        || compareName(first, second);
    };
    const compare = {
      newest: (first, second) => compareAdded(first, second, true),
      oldest: (first, second) => compareAdded(first, second, false),
      'name-desc': (first, second) => compareName(second, first),
      'rarity-asc': compareRarity,
      'rarity-desc': (first, second) => compareRarity(second, first),
      type: (first, second) => first.typeLabel.localeCompare(second.typeLabel, 'es') || compareName(first, second),
      set: (first, second) => first.setValue.localeCompare(second.setValue, 'es') || compareName(first, second)
    }[sortMode] || compareName;

    return cosmetics.filter((cosmetic) => (!query || cosmetic.name.toLocaleLowerCase('es').includes(query))
      && (!selectedCosmeticTypes.size || selectedCosmeticTypes.has(cosmetic.typeValue))
      && (!set || cosmetic.setValue === set)
      && (!rarity || cosmetic.rarityValue === rarity))
      .sort(compare);
  }

  function renderCatalog() {
    if (!cosmetics.length) return;
    const results = getFilteredCosmetics();
    bulkAddMessage.textContent = '';
    const fragment = document.createDocumentFragment();
    results.slice(0, catalogLimit).forEach((cosmetic) => fragment.appendChild(makeCosmeticCard(cosmetic, false)));
    catalogGrid.replaceChildren(fragment);
    catalogCount.textContent = `${results.length.toLocaleString('es')} resultados`;
    catalogMessage.classList.remove('catalog-error');
    catalogMessage.textContent = results.length ? '' : 'No hay cosméticos que coincidan con esos filtros.';
    loadMoreCosmeticsButton.hidden = results.length <= catalogLimit;
    const selectedCollection = getSelectedCollection();
    const selectedIds = new Set(selectedCollection?.items.map((item) => item.id) || []);
    const addableCount = results.reduce((count, cosmetic) => count + Number(!selectedIds.has(cosmetic.id)), 0);
    bulkAddCosmeticsButton.dataset.addableCount = String(addableCount);
    bulkAddCosmeticsButton.textContent = `Añadir resultados a la colección (${addableCount.toLocaleString('es')})`;
    bulkAddCosmeticsButton.disabled = storageLocked || !selectedCollection || addableCount === 0;
    refreshCollectionControls();
  }

  function renderCollection() {
    if (collectionView.hidden) return;
    const collection = getSelectedCollection();
    collectionGrid.replaceChildren();
    loadMoreCollectionButton.hidden = true;
    if (!collection) {
      document.getElementById('collectionTitle').textContent = '';
      collectionMessage.textContent = 'Selecciona una colección para ver su contenido.';
      return;
    }

    document.getElementById('collectionTitle').textContent = collection.name;
    const byId = new Map(cosmetics.map((cosmetic) => [cosmetic.id, cosmetic]));
    const items = collection.items.map((saved) => byId.get(saved.id) || {
      id: saved.id,
      name: saved.name,
      typeLabel: saved.type,
      image: saved.image
    });
    const fragment = document.createDocumentFragment();
    items.slice(0, collectionLimit).forEach((cosmetic, index) => {
      fragment.appendChild(makeCosmeticCard(cosmetic, true, index, items.length));
    });
    collectionGrid.replaceChildren(fragment);
    catalogCount.textContent = `${items.length.toLocaleString('es')} elementos`;
    collectionMessage.textContent = items.length ? '' : 'Esta colección está vacía.';
    loadMoreCollectionButton.hidden = items.length <= collectionLimit;
  }

  function toggleCosmeticInCollection(cosmetic) {
    const selected = getSelectedCollection();
    if (!selected || storageLocked) return;
    const exists = selected.items.some((item) => item.id === cosmetic.id);
    const nextCollections = collectionData.map((collection) => collection.id !== selected.id
      ? collection
      : {
        ...collection,
        items: exists
          ? collection.items.filter((item) => item.id !== cosmetic.id)
          : [...collection.items, {
            id: cosmetic.id,
            name: cosmetic.name,
            type: cosmetic.typeLabel,
            image: cosmetic.image
          }]
      });
    if (saveCollections(nextCollections)) {
      renderCatalog();
      renderCollection();
    }
  }

  function removeCosmeticFromCollection(cosmeticId) {
    const selected = getSelectedCollection();
    if (!selected || storageLocked) return;
    const nextCollections = collectionData.map((collection) => collection.id !== selected.id
      ? collection
      : { ...collection, items: collection.items.filter((item) => item.id !== cosmeticId) });
    if (saveCollections(nextCollections)) {
      renderCatalog();
      renderCollection();
    }
  }

  function moveCosmeticInCollection(cosmeticId, direction) {
    const selected = getSelectedCollection();
    if (!selected || storageLocked) return;
    const items = [...selected.items];
    const currentIndex = items.findIndex((item) => item.id === cosmeticId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= items.length) return;

    [items[currentIndex], items[targetIndex]] = [items[targetIndex], items[currentIndex]];
    const nextCollections = collectionData.map((collection) => collection.id === selected.id
      ? { ...collection, items }
      : collection);
    if (saveCollections(nextCollections)) renderCollection();
  }

  function addFilteredCosmeticsToCollection() {
    const selected = getSelectedCollection();
    if (!selected || storageLocked) return;
    const selectedIds = new Set(selected.items.map((item) => item.id));
    const additions = getFilteredCosmetics()
      .filter((cosmetic) => !selectedIds.has(cosmetic.id))
      .map((cosmetic) => ({
        id: cosmetic.id,
        name: cosmetic.name,
        type: cosmetic.typeLabel,
        image: cosmetic.image
      }));

    if (!additions.length) {
      bulkAddMessage.textContent = `Todos los resultados ya están en «${selected.name}».`;
      return;
    }

    const nextCollections = collectionData.map((collection) => collection.id === selected.id
      ? { ...collection, items: [...collection.items, ...additions] }
      : collection);
    if (saveCollections(nextCollections)) {
      catalogLimit = pageSize;
      renderCatalog();
      renderCollection();
      bulkAddMessage.textContent = `Se añadieron ${additions.length.toLocaleString('es')} cosméticos a «${selected.name}».`;
    }
  }

  document.getElementById('createCollectionForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('newCollectionName');
    const name = input.value.trim();
    if (!name || storageLocked) return;
    const collection = { id: createId(), name, items: [] };
    if (saveCollections([...collectionData, collection])) {
      selectedCollectionId = collection.id;
      input.value = '';
      refreshCollectionControls();
      renderCatalog();
      renderCollection();
    }
  });

  collectionPicker.addEventListener('change', () => {
    selectedCollectionId = collectionPicker.value;
    bulkAddMessage.textContent = '';
    refreshCollectionControls();
    renderCatalog();
    renderCollection();
  });

  document.getElementById('renameCollectionForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = getSelectedCollection();
    if (!selected || storageLocked) return;
    const input = document.getElementById('renameCollectionName');
    const name = input.value.trim();
    if (!name || name === selected.name) return;
    const nextCollections = collectionData.map((collection) => collection.id === selected.id
      ? { ...collection, name }
      : collection);
    if (saveCollections(nextCollections)) {
      input.value = '';
      refreshCollectionControls();
      renderCollection();
    }
  });

  document.getElementById('deleteCollectionButton').addEventListener('click', () => {
    const selected = getSelectedCollection();
    if (!selected || storageLocked) return;
    if (selected.items.length && !window.confirm(`La colección contiene ${selected.items.length} cosméticos. ¿Eliminarla?`)) return;
    if (saveCollections(collectionData.filter((collection) => collection.id !== selected.id))) {
      selectedCollectionId = '';
      refreshCollectionControls();
      renderCatalog();
      renderCollection();
    }
  });

  document.getElementById('viewCollectionButton').addEventListener('click', () => {
    catalogView.hidden = true;
    collectionView.hidden = false;
    document.getElementById('viewCollectionButton').hidden = true;
    document.getElementById('backToCatalogButton').hidden = false;
    collectionLimit = pageSize;
    renderCollection();
  });

  document.getElementById('backToCatalogButton').addEventListener('click', () => {
    collectionView.hidden = true;
    catalogView.hidden = false;
    document.getElementById('viewCollectionButton').hidden = false;
    document.getElementById('backToCatalogButton').hidden = true;
    renderCatalog();
  });

  document.getElementById('loadMoreCosmetics').addEventListener('click', () => {
    catalogLimit += pageSize;
    renderCatalog();
  });

  document.getElementById('loadMoreCollectionItems').addEventListener('click', () => {
    collectionLimit += pageSize;
    renderCollection();
  });

  document.getElementById('refreshShopButton').addEventListener('click', () => loadShop(true));
  document.getElementById('loadMoreShopOffers').addEventListener('click', () => {
    shopLimit += pageSize;
    renderShop();
  });
  ['shopCategoryFilter', 'shopSort'].forEach((id) => {
    document.getElementById(id).addEventListener('change', () => {
      shopLimit = pageSize;
      renderShop();
    });
  });
  document.getElementById('shopSearch').addEventListener('input', () => {
    window.clearTimeout(shopSearchTimer);
    shopSearchTimer = window.setTimeout(() => {
      shopLimit = pageSize;
      renderShop();
    }, 140);
  });

  document.getElementById('closeCosmeticDetail').addEventListener('click', () => {
    document.getElementById('cosmeticDetailDialog').close();
  });

  document.getElementById('cosmeticDetailDialog').addEventListener('close', () => {
    activeDetailCosmetic = null;
  });

  function selectAppTab(selectedTab) {
    const spiritsSelected = selectedTab === spiritsTab;
    const cosmeticsSelected = selectedTab === cosmeticsTab;
    try {
      localStorage.setItem(activeTabKey, selectedTab.id);
    } catch {
      // The tab still works when browser storage is unavailable.
    }
    document.getElementById('spiritsView').hidden = !spiritsSelected;
    document.getElementById('cosmeticsCatalog').hidden = !cosmeticsSelected;
    shopView.hidden = selectedTab !== shopTab;
    appTabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab === selectedTab)));
    if (cosmeticsSelected && !catalogLoadStarted) {
      catalogLoadStarted = true;
      loadCatalog();
    }
    if (cosmeticsSelected || selectedTab === shopTab) loadShop();
  }

  function getSavedAppTab() {
    try {
      const savedTabId = localStorage.getItem(activeTabKey);
      return appTabs.find((tab) => tab.id === savedTabId) || spiritsTab;
    } catch {
      return spiritsTab;
    }
  }

  spiritsTab.addEventListener('click', () => selectAppTab(spiritsTab));
  cosmeticsTab.addEventListener('click', () => selectAppTab(cosmeticsTab));
  shopTab.addEventListener('click', () => selectAppTab(shopTab));
  appTabs.forEach((tab) => {
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const nextIndex = (appTabs.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : appTabs.length - 1)) % appTabs.length;
      const nextTab = appTabs[nextIndex];
      selectAppTab(nextTab);
      nextTab.focus();
    });
  });

  bulkAddCosmeticsButton.addEventListener('click', addFilteredCosmeticsToCollection);

  ['cosmeticSetFilter', 'cosmeticRarityFilter', 'cosmeticSort'].forEach((id) => {
    document.getElementById(id).addEventListener('change', () => {
      catalogLimit = pageSize;
      bulkAddMessage.textContent = '';
      renderCatalog();
    });
  });

  document.getElementById('cosmeticSearch').addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      catalogLimit = pageSize;
      bulkAddMessage.textContent = '';
      renderCatalog();
    }, 140);
  });

  refreshCollectionControls();
  selectAppTab(getSavedAppTab());
})();