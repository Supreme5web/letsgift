(function () {
  'use strict';

  /* ─── CELEBRITY DATA
     photo: null = fetched live from Wikipedia API at runtime
  ─── */
  const celebrities = [
    {
      id: 'kevin-costner',
      name: 'Kevin Costner',
      known: 'Actor & Director',
      bio: 'Oscar-winning filmmaker and actor. Known for Yellowstone, Dances with Wolves, and The Bodyguard.',
      wiki: 'Kevin_Costner',
      category: 'Actor',
    },
    {
      id: 'simone-susinna',
      name: 'Simone Susinna',
      known: 'Model & Actor',
      bio: 'International model and rising screen talent. Known for 365 Days and his striking editorials worldwide.',
      wiki: 'Simone_Susinna',
      category: 'Model',
    },
    {
      id: 'matt-rife',
      name: 'Matt Rife',
      known: 'Comedian',
      bio: 'Stand-up comedian and social media sensation. His sold-out world tour redefined modern comedy.',
      wiki: 'Matt_Rife',
      category: 'Comedian',
    },
    {
      id: 'emma-watson',
      name: 'Emma Watson',
      known: 'Actress & Activist',
      bio: 'Award-winning actress and UN Women Goodwill Ambassador. Celebrated for Harry Potter and Little Women.',
      wiki: 'Emma_Watson',
      category: 'Actress',
    },
    {
      id: 'ed-sheeran',
      name: 'Ed Sheeran',
      known: 'Singer & Songwriter',
      bio: 'Multi-Grammy-winning artist and one of the best-selling musicians of all time. Known for Shape of You and Perfect.',
      wiki: 'Ed_Sheeran',
      category: 'Musician',
    },
    {
      id: 'zendaya',
      name: 'Zendaya',
      known: 'Actress & Fashion Icon',
      bio: 'Emmy-winning actress and global style icon. Known for Euphoria, Dune, and her iconic red carpet moments.',
      wiki: 'Zendaya',
      category: 'Actress',
    },
    {
      id: 'ryan-reynolds',
      name: 'Ryan Reynolds',
      known: 'Actor & Entrepreneur',
      bio: 'Actor, producer, and business mogul behind Aviation Gin and Wrexham AFC. Known for Deadpool and Free Guy.',
      wiki: 'Ryan_Reynolds',
      category: 'Actor',
    },
    {
      id: 'beyonce',
      name: 'Beyoncé',
      known: 'Singer & Cultural Icon',
      bio: 'The most awarded recording artist of all time. Artist, entrepreneur, and cultural force across generations.',
      wiki: 'Beyoncé',
      category: 'Musician',
    },
    {
      id: 'tom-hardy',
      name: 'Tom Hardy',
      known: 'Actor',
      bio: 'Versatile British actor known for Venom, Mad Max: Fury Road, and his BAFTA-winning performance in Locke.',
      wiki: 'Tom_Hardy',
      category: 'Actor',
    },
    {
      id: 'taylor-swift',
      name: 'Taylor Swift',
      known: 'Singer & Songwriter',
      bio: 'Record-breaking artist and cultural phenomenon. The Eras Tour became the highest-grossing concert tour in history.',
      wiki: 'Taylor_Swift',
      category: 'Musician',
    },
    {
      id: 'idris-elba',
      name: 'Idris Elba',
      known: 'Actor & DJ',
      bio: 'Golden Globe-winning actor and acclaimed DJ. Known for The Wire, Luther, and Beasts of No Nation.',
      wiki: 'Idris_Elba',
      category: 'Actor',
    },
    {
      id: 'priyanka-chopra',
      name: 'Priyanka Chopra',
      known: 'Actress & Producer',
      bio: 'Global icon and UNICEF Goodwill Ambassador. Known for Quantico, The Matrix Resurrections, and her humanitarian work.',
      wiki: 'Priyanka_Chopra',
      category: 'Actress',
    },
  ];

  /* ─── PHOTO CACHE ─── */
  const photoCache = {};

  /* ─── PLACEHOLDER while loading ─── */
  const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' viewBox='0 0 400 533'%3E%3Crect width='400' height='533' fill='%23f0e8de'/%3E%3Crect x='140' y='120' width='120' height='120' rx='60' fill='%23d4c4b0'/%3E%3Crect x='80' y='280' width='240' height='160' rx='12' fill='%23d4c4b0'/%3E%3C/svg%3E`;

  /* ─── FETCH PHOTO from Wikipedia REST API ─── */
  async function fetchPhoto(celeb) {
    if (photoCache[celeb.id]) return photoCache[celeb.id];

    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(celeb.wiki)}`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (!res.ok) throw new Error('not ok');
      const data = await res.json();
      const url = data?.thumbnail?.source || PLACEHOLDER;
      // Bump to 400px wide for better quality
      const hq = url.replace(/\/\d+px-/, '/400px-');
      photoCache[celeb.id] = hq;
      return hq;
    } catch {
      photoCache[celeb.id] = PLACEHOLDER;
      return PLACEHOLDER;
    }
  }

  /* ─── CATEGORIES ─── */
  const categories = ['All', ...new Set(celebrities.map(c => c.category))];

  /* ─── STATE ─── */
  let selectedId = null;
  let activeCategory = 'All';
  let searchQuery = '';

  /* ─── DOM REFS ─── */
  const grid              = document.getElementById('celebGrid');
  const profile           = document.getElementById('celebProfile');
  const profileAvatar     = document.getElementById('celebProfileAvatar');
  const profileName       = document.getElementById('celebProfileName');
  const profileBio        = document.getElementById('celebProfileBio');
  const profileLabel      = document.getElementById('celebProfileLabel');
  const wishlistHeading   = document.getElementById('wishlistHeading');
  const checkoutCelebrity = document.getElementById('checkoutCelebrity');
  const searchInput       = document.getElementById('celebSearch');

  /* ─── BUILD CATEGORY BAR ─── */
  function buildCategoryBar() {
    const bar = document.createElement('div');
    bar.className = 'celeb-cat-bar';
    bar.setAttribute('role', 'tablist');

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'celeb-cat-pill' + (cat === activeCategory ? ' is-active' : '');
      btn.textContent = cat;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', cat === activeCategory ? 'true' : 'false');
      btn.addEventListener('click', () => {
        activeCategory = cat;
        document.querySelectorAll('.celeb-cat-pill').forEach(b => {
          b.classList.toggle('is-active', b.textContent === cat);
          b.setAttribute('aria-selected', b.textContent === cat ? 'true' : 'false');
        });
        renderGrid();
      });
      bar.appendChild(btn);
    });

    grid.parentNode.insertBefore(bar, grid);
  }

  /* ─── RENDER GRID ─── */
  function renderGrid() {
    const query = searchQuery.toLowerCase().trim();

    const filtered = celebrities.filter(c => {
      const matchesCat   = activeCategory === 'All' || c.category === activeCategory;
      const matchesSearch = !query ||
        c.name.toLowerCase().includes(query) ||
        c.known.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'celeb-empty';
      empty.textContent = 'No celebrities match your search.';
      grid.appendChild(empty);
      return;
    }

    filtered.forEach(celeb => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'celeb-card' + (celeb.id === selectedId ? ' is-selected' : '');
      card.setAttribute('role', 'option');
      card.setAttribute('aria-selected', celeb.id === selectedId ? 'true' : 'false');
      card.setAttribute('data-celeb-id', celeb.id);

      const cachedPhoto = photoCache[celeb.id] || PLACEHOLDER;

      card.innerHTML = `
        <div class="celeb-card-img-wrap">
          <img
            src="${cachedPhoto}"
            alt="${celeb.name}"
            class="celeb-card-img"
            data-celeb-img="${celeb.id}"
            loading="lazy"
          />
          <div class="celeb-card-overlay" aria-hidden="true"></div>
          <div class="celeb-card-check" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5L5 9.5L11 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="celeb-card-body">
          <span class="celeb-card-category">${celeb.category}</span>
          <strong class="celeb-card-name">${celeb.name}</strong>
          <span class="celeb-card-known">${celeb.known}</span>
        </div>
      `;

      card.addEventListener('click', () => selectCeleb(celeb.id));
      grid.appendChild(card);

      // Load real photo if not cached yet
      if (!photoCache[celeb.id]) {
        fetchPhoto(celeb).then(url => {
          const img = grid.querySelector(`[data-celeb-img="${celeb.id}"]`);
          if (img) img.src = url;
          // Also update profile if this celeb is selected
          if (selectedId === celeb.id) {
            profileAvatar.src = url;
          }
        });
      }
    });
  }

  /* ─── SELECT CELEBRITY ─── */
  async function selectCeleb(id) {
    selectedId = id;
    const celeb = celebrities.find(c => c.id === id);
    if (!celeb) return;

    // Update card states
    document.querySelectorAll('.celeb-card').forEach(card => {
      const isSelected = card.dataset.celebId === id;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // Show profile with placeholder first
    const photo = photoCache[id] || PLACEHOLDER;
    profileAvatar.src = photo;
    profileAvatar.alt = celeb.name;
    profileName.textContent = celeb.name;
    profileBio.textContent = celeb.bio;
    profileLabel.textContent = celeb.known;
    profile.classList.add('is-visible');

    // If photo not loaded yet, fetch and update
    if (!photoCache[id]) {
      const url = await fetchPhoto(celeb);
      profileAvatar.src = url;
    }

    // Update wishlist heading and checkout field
    wishlistHeading.textContent = celeb.name + '\u2019s wishlist \u2014 choose a gift below.';
    checkoutCelebrity.value = celeb.name;

    // Scroll to wishlist
    setTimeout(() => {
      document.getElementById('wishlist').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  /* ─── SEARCH ─── */
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderGrid();
  });

  /* ─── INIT ─── */
  buildCategoryBar();
  renderGrid();

  // Pre-fetch all photos in the background after render
  celebrities.forEach(c => fetchPhoto(c));

})();
