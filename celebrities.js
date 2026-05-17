(function () {
  'use strict';

  /* ─── CELEBRITY DATA ─── */
  const celebrities = [
    {
      id: 'kevin-costner',
      name: 'Kevin Costner',
      known: 'Actor & Director',
      bio: 'Oscar-winning filmmaker and actor. Known for Yellowstone, Dances with Wolves, and The Bodyguard.',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      category: 'Actor',
    },
    {
      id: 'simone-susinna',
      name: 'Simone Susinna',
      known: 'Model & Actor',
      bio: 'International model and rising screen talent. Known for 365 Days and his striking editorials worldwide.',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      category: 'Model',
    },
    {
      id: 'matt-rife',
      name: 'Matt Rife',
      known: 'Comedian',
      bio: 'Stand-up comedian and social media sensation. His sold-out world tour redefined modern comedy.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      category: 'Comedian',
    },
    {
      id: 'emma-watson',
      name: 'Emma Watson',
      known: 'Actress & Activist',
      bio: 'Award-winning actress and UN Women Goodwill Ambassador. Celebrated for Harry Potter and Little Women.',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      category: 'Actress',
    },
    {
      id: 'ed-sheeran',
      name: 'Ed Sheeran',
      known: 'Singer & Songwriter',
      bio: 'Multi-Grammy-winning artist and one of the best-selling musicians of all time. Known for Shape of You and Perfect.',
      photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
      category: 'Musician',
    },
    {
      id: 'zendaya',
      name: 'Zendaya',
      known: 'Actress & Fashion Icon',
      bio: 'Emmy-winning actress and global style icon. Known for Euphoria, Dune, and her groundbreaking red carpet moments.',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
      category: 'Actress',
    },
    {
      id: 'ryan-reynolds',
      name: 'Ryan Reynolds',
      known: 'Actor & Entrepreneur',
      bio: 'Actor, producer, and business mogul behind Aviation Gin and Wrexham AFC. Known for Deadpool and Free Guy.',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      category: 'Actor',
    },
    {
      id: 'beyonce',
      name: 'Beyoncé',
      known: 'Singer & Cultural Icon',
      bio: 'The most awarded recording artist of all time. Artist, entrepreneur, and cultural force across generations.',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
      category: 'Musician',
    },
    {
      id: 'tom-hardy',
      name: 'Tom Hardy',
      known: 'Actor',
      bio: 'Versatile British actor known for Venom, Mad Max: Fury Road, and his BAFTA-winning performance in Locke.',
      photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80',
      category: 'Actor',
    },
    {
      id: 'taylor-swift',
      name: 'Taylor Swift',
      known: 'Singer & Songwriter',
      bio: 'Record-breaking artist and cultural phenomenon. The Eras Tour became the highest-grossing concert tour in history.',
      photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=400&q=80',
      category: 'Musician',
    },
    {
      id: 'idris-elba',
      name: 'Idris Elba',
      known: 'Actor & DJ',
      bio: 'Golden Globe-winning actor and acclaimed DJ. Known for The Wire, Luther, and Beasts of No Nation.',
      photo: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=400&q=80',
      category: 'Actor',
    },
    {
      id: 'priyanka-chopra',
      name: 'Priyanka Chopra',
      known: 'Actress & Producer',
      bio: 'Global icon and UNICEF Goodwill Ambassador. Known for Quantico, The Matrix Resurrections, and her humanitarian work.',
      photo: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?auto=format&fit=crop&w=400&q=80',
      category: 'Actress',
    },
  ];

  /* ─── CATEGORIES ─── */
  const categories = ['All', ...new Set(celebrities.map(c => c.category))];

  /* ─── STATE ─── */
  let selectedId = null;
  let activeCategory = 'All';
  let searchQuery = '';

  /* ─── DOM REFS ─── */
  const grid        = document.getElementById('celebGrid');
  const profile     = document.getElementById('celebProfile');
  const profileAvatar = document.getElementById('celebProfileAvatar');
  const profileName   = document.getElementById('celebProfileName');
  const profileBio    = document.getElementById('celebProfileBio');
  const profileLabel  = document.getElementById('celebProfileLabel');
  const wishlistHeading = document.getElementById('wishlistHeading');
  const checkoutCelebrity = document.getElementById('checkoutCelebrity');
  const searchInput  = document.getElementById('celebSearch');

  /* ─── BUILD CATEGORY PILLS ─── */
  function buildCategoryBar() {
    const bar = document.createElement('div');
    bar.className = 'celeb-cat-bar';
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', 'Filter by category');

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

    // Insert before the grid
    grid.parentNode.insertBefore(bar, grid);
  }

  /* ─── RENDER GRID ─── */
  function renderGrid() {
    const query = searchQuery.toLowerCase().trim();

    const filtered = celebrities.filter(c => {
      const matchesCat = activeCategory === 'All' || c.category === activeCategory;
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

      card.innerHTML = `
        <div class="celeb-card-img-wrap">
          <img src="${celeb.photo}" alt="${celeb.name}" loading="lazy" />
          <div class="celeb-card-check" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
    });
  }

  /* ─── SELECT CELEBRITY ─── */
  function selectCeleb(id) {
    selectedId = id;
    const celeb = celebrities.find(c => c.id === id);
    if (!celeb) return;

    // Update grid selections
    document.querySelectorAll('.celeb-card').forEach(card => {
      const isSelected = card.dataset.celebId === id;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // Update profile strip
    profileAvatar.src = celeb.photo;
    profileAvatar.alt = celeb.name;
    profileName.textContent = celeb.name;
    profileBio.textContent = celeb.bio;
    profileLabel.textContent = celeb.known;
    profile.classList.add('is-visible');

    // Update wishlist heading
    wishlistHeading.textContent = celeb.name + '\u2019s wishlist — choose a gift below.';

    // Pass celebrity name to checkout
    checkoutCelebrity.value = celeb.name;

    // Smooth scroll to wishlist
    setTimeout(() => {
      document.getElementById('wishlist').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 180);
  }

  /* ─── SEARCH ─── */
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderGrid();
  });

  /* ─── INIT ─── */
  buildCategoryBar();
  renderGrid();

})();
