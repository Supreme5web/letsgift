(function () {
  'use strict';

  /*
   * Photos sourced from Wikimedia Commons — freely licensed under CC BY-SA or similar.
   * Direct upload.wikimedia.org URLs work in browsers (no CORS restriction).
   * Format: /wikipedia/commons/thumb/[a]/[ab]/Filename.jpg/400px-Filename.jpg
   */
  const celebrities = [
    {
      id: 'kevin-costner',
      name: 'Kevin Costner',
      known: 'Actor & Director',
      bio: 'Oscar-winning filmmaker and actor. Known for Yellowstone, Dances with Wolves, and The Bodyguard.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kevin_Costner_-_2018_%28cropped%29.jpg/400px-Kevin_Costner_-_2018_%28cropped%29.jpg',
      category: 'Actor',
    },
    {
      id: 'simone-susinna',
      name: 'Simone Susinna',
      known: 'Model & Actor',
      bio: 'International model and rising screen talent. Known for 365 Days and his striking editorials worldwide.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Simone_Susinna_-_Sardinia_%28cropped%29.jpg/400px-Simone_Susinna_-_Sardinia_%28cropped%29.jpg',
      category: 'Model',
    },
    {
      id: 'matt-rife',
      name: 'Matt Rife',
      known: 'Comedian',
      bio: 'Stand-up comedian and social media sensation. His sold-out world tour redefined modern comedy.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Matt_Rife_2023.jpg/400px-Matt_Rife_2023.jpg',
      category: 'Comedian',
    },
    {
      id: 'emma-watson',
      name: 'Emma Watson',
      known: 'Actress & Activist',
      bio: 'Award-winning actress and UN Women Goodwill Ambassador. Celebrated for Harry Potter and Little Women.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/400px-Emma_Watson_2013.jpg',
      category: 'Actress',
    },
    {
      id: 'ed-sheeran',
      name: 'Ed Sheeran',
      known: 'Singer & Songwriter',
      bio: 'Multi-Grammy-winning artist and one of the best-selling musicians of all time. Known for Shape of You and Perfect.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Ed_Sheeran_-_Multiply_Tour%2C_Nashville_2014.jpg/400px-Ed_Sheeran_-_Multiply_Tour%2C_Nashville_2014.jpg',
      category: 'Musician',
    },
    {
      id: 'zendaya',
      name: 'Zendaya',
      known: 'Actress & Fashion Icon',
      bio: 'Emmy-winning actress and global style icon. Known for Euphoria, Dune, and her iconic red carpet moments.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Zendaya_at_the_2019_NAACP_Image_Awards_%28cropped%29.jpg/400px-Zendaya_at_the_2019_NAACP_Image_Awards_%28cropped%29.jpg',
      category: 'Actress',
    },
    {
      id: 'ryan-reynolds',
      name: 'Ryan Reynolds',
      known: 'Actor & Entrepreneur',
      bio: 'Actor, producer, and business mogul behind Aviation Gin and Wrexham AFC. Known for Deadpool and Free Guy.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ryan_Reynolds_2016.jpg/400px-Ryan_Reynolds_2016.jpg',
      category: 'Actor',
    },
    {
      id: 'beyonce',
      name: 'Beyoncé',
      known: 'Singer & Cultural Icon',
      bio: 'The most awarded recording artist of all time. Artist, entrepreneur, and cultural force across generations.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Beyonc%C3%A9_-_GMA_Summer_Concert_2011.jpg/400px-Beyonc%C3%A9_-_GMA_Summer_Concert_2011.jpg',
      category: 'Musician',
    },
    {
      id: 'tom-hardy',
      name: 'Tom Hardy',
      known: 'Actor',
      bio: 'Versatile British actor known for Venom, Mad Max: Fury Road, and his BAFTA-winning performance in Locke.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Tom_Hardy_by_Gage_Skidmore.jpg/400px-Tom_Hardy_by_Gage_Skidmore.jpg',
      category: 'Actor',
    },
    {
      id: 'taylor-swift',
      name: 'Taylor Swift',
      known: 'Singer & Songwriter',
      bio: 'Record-breaking artist and cultural phenomenon. The Eras Tour became the highest-grossing concert tour in history.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/400px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png',
      category: 'Musician',
    },
    {
      id: 'idris-elba',
      name: 'Idris Elba',
      known: 'Actor & DJ',
      bio: 'Golden Globe-winning actor and acclaimed DJ. Known for The Wire, Luther, and Beasts of No Nation.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Idris_Elba-7837_%28cropped%29.jpg/400px-Idris_Elba-7837_%28cropped%29.jpg',
      category: 'Actor',
    },
    {
      id: 'priyanka-chopra',
      name: 'Priyanka Chopra',
      known: 'Actress & Producer',
      bio: 'Global icon and UNICEF Goodwill Ambassador. Known for Quantico, The Matrix Resurrections, and her humanitarian work.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Priyanka_Chopra_Jonas_at_Emmys_2017_%28cropped%29.jpg/400px-Priyanka_Chopra_Jonas_at_Emmys_2017_%28cropped%29.jpg',
      category: 'Actress',
    },
  ];

  /* ─── FALLBACK placeholder SVG ─── */
  const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' viewBox='0 0 400 533'%3E%3Crect width='400' height='533' fill='%23f0e8de'/%3E%3Ccircle cx='200' cy='180' r='68' fill='%23d4c4b0'/%3E%3Crect x='80' y='290' width='240' height='180' rx='16' fill='%23d4c4b0'/%3E%3C/svg%3E`;

  /* handle broken images gracefully */
  function onImgError(img) {
    img.onerror = null;
    img.src = PLACEHOLDER;
  }

  /* ─── CATEGORIES ─── */
  const categories = ['All', ...new Set(celebrities.map(c => c.category))];

  /* ─── STATE ─── */
  let selectedId      = null;
  let activeCategory  = 'All';
  let searchQuery     = '';

  /* ─── DOM REFS ─── */
  const grid               = document.getElementById('celebGrid');
  const profile            = document.getElementById('celebProfile');
  const profileAvatar      = document.getElementById('celebProfileAvatar');
  const profileName        = document.getElementById('celebProfileName');
  const profileBio         = document.getElementById('celebProfileBio');
  const profileLabel       = document.getElementById('celebProfileLabel');
  const wishlistHeading    = document.getElementById('wishlistHeading');
  const checkoutCelebrity  = document.getElementById('checkoutCelebrity');
  const searchInput        = document.getElementById('celebSearch');

  /* ─── CATEGORY BAR ─── */
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
      const matchesCat    = activeCategory === 'All' || c.category === activeCategory;
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
          <img
            src="${celeb.photo}"
            alt="${celeb.name}"
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

      // Fallback for broken images
      card.querySelector('img').addEventListener('error', function () { onImgError(this); });

      card.addEventListener('click', () => selectCeleb(celeb.id));
      grid.appendChild(card);
    });
  }

  /* ─── SELECT CELEBRITY ─── */
  function selectCeleb(id) {
    selectedId = id;
    const celeb = celebrities.find(c => c.id === id);
    if (!celeb) return;

    document.querySelectorAll('.celeb-card').forEach(card => {
      const isSelected = card.dataset.celebId === id;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    profileAvatar.src    = celeb.photo;
    profileAvatar.alt    = celeb.name;
    profileAvatar.onerror = function () { onImgError(this); };
    profileName.textContent  = celeb.name;
    profileBio.textContent   = celeb.bio;
    profileLabel.textContent = celeb.known;
    profile.classList.add('is-visible');

    wishlistHeading.textContent  = celeb.name + '\u2019s wishlist \u2014 choose a gift below.';
    checkoutCelebrity.value      = celeb.name;

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

})();
