(function () {
  'use strict';

  const storedRecipients = [
    {
      name: 'Kevin Costner',
      known: 'Actor & Director',
      bio: 'Oscar-winning filmmaker and actor. Known for Yellowstone, Dances with Wolves, and The Bodyguard.',
      photo: 'assets/kevincostner.jpg',
    },
    {
      name: 'Simone Susinna',
      known: 'Model & Actor',
      bio: 'International model and rising screen talent. Known for 365 Days and his striking editorials worldwide.',
      photo: 'assets/simonesusinna.jpg',
    },
    {
      name: 'Matt Rife',
      known: 'Comedian',
      bio: 'Stand-up comedian and social media sensation. His sold-out world tour redefined modern comedy.',
      photo: 'assets/mattrife.jpg',
    },
    {
      name: 'Emma Watson',
      known: 'Actress & Activist',
      bio: 'Award-winning actress and UN Women Goodwill Ambassador. Celebrated for Harry Potter and Little Women.',
      photo: 'assets/emmawatson.jpg',
    },
    {
      name: 'Ed Sheeran',
      known: 'Singer & Songwriter',
      bio: 'Multi-Grammy-winning artist and one of the best-selling musicians of all time. Known for Shape of You and Perfect.',
      photo: 'assets/edsheeran.jpg',
    },

    {
      name: 'Ryan Reynolds',
      known: 'Actor & Entrepreneur',
      bio: 'Actor, producer, and business mogul behind Aviation Gin and Wrexham AFC. Known for Deadpool and Free Guy.',
      photo: 'assets/ryanreynolds.jpg',
    },

    {
      name: 'Tom Hardy',
      known: 'Actor',
      bio: 'Versatile British actor known for Venom, Mad Max: Fury Road, and his BAFTA-winning performance in Locke.',
      photo: 'assets/tomhardy.jpg',
    },
  
    {
      name: 'Idris Elba',
      known: 'Actor & DJ',
      bio: 'Golden Globe-winning actor and acclaimed DJ. Known for The Wire, Luther, and Beasts of No Nation.',
      photo: 'assets/idriselba.jpg',
    },
  
  ];

  const recipientForm = document.querySelector('[data-recipient-form]');
  const recipientInput = document.querySelector('[data-recipient-name]');
  const recipientSuggestions = document.querySelector('[data-recipient-suggestions]');
  const recipientStatus = document.querySelector('[data-recipient-status]');
  const modal = document.querySelector('[data-recipient-modal]');
  const modalName = document.querySelector('[data-recipient-modal-name]');
  const modalPhoto = document.querySelector('[data-recipient-photo]');
  const confirmButton = document.querySelector('[data-recipient-confirm]');
  const cancelButton = document.querySelector('[data-recipient-cancel]');
  const profile = document.getElementById('celebProfile');
  const profileAvatar = document.getElementById('celebProfileAvatar');
  const profileName = document.getElementById('celebProfileName');
  const profileBio = document.getElementById('celebProfileBio');
  const profileLabel = document.getElementById('celebProfileLabel');
  const wishlistHeading = document.getElementById('wishlistHeading');
  const checkoutRecipient = document.getElementById('checkoutCelebrity');

  let pendingRecipient = '';
  let pendingPhoto = '';
  let pendingKnown = '';
  let pendingBio = '';
  let searchTimer;

  function cleanName(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function normalizeName(value) {
    return cleanName(value).toLowerCase();
  }

  function recipientMatches(recipient, query) {
    const normalizedQuery = normalizeName(query);
    if (!normalizedQuery) return false;

    const normalizedName = normalizeName(recipient.name);
    const firstName = normalizedName.split(' ')[0];

    return normalizedName.includes(normalizedQuery) || firstName.startsWith(normalizedQuery);
  }

  function getMatchingRecipients(query) {
    return storedRecipients
      .filter(recipient => recipientMatches(recipient, query))
      .slice(0, 6);
  }

  function findStoredRecipient(name) {
    const normalized = normalizeName(name);
    const exactMatch = storedRecipients.find(recipient => normalizeName(recipient.name) === normalized);
    if (exactMatch) return exactMatch;

    const firstNameMatch = storedRecipients.find(recipient => normalizeName(recipient.name).split(' ')[0] === normalized);
    if (firstNameMatch) return firstNameMatch;

    const matches = getMatchingRecipients(name);
    return matches.length === 1 ? matches[0] : null;
  }

  function setStatus(message, isError = false) {
    recipientStatus.textContent = message;
    recipientStatus.classList.toggle('is-error', isError);
  }

  function clearSuggestions() {
    recipientSuggestions.innerHTML = '';
    recipientSuggestions.classList.remove('is-visible');
  }

  function renderSuggestions(query) {
    const matches = getMatchingRecipients(query);

    if (!query || matches.length === 0) {
      clearSuggestions();
      return;
    }

    recipientSuggestions.innerHTML = matches
      .map((recipient, index) => `
        <button type="button" class="recipient-suggestion" data-suggestion-index="${index}" role="option">
          <img src="${recipient.photo}" alt="" loading="lazy" />
          <span>
            <strong>${recipient.name}</strong>
          </span>
        </button>
      `)
      .join('');

    recipientSuggestions.classList.add('is-visible');
  }

  function selectSuggestion(index) {
    const matches = getMatchingRecipients(recipientInput.value);
    const recipient = matches[index];
    if (!recipient) return;

    recipientInput.value = recipient.name;
    setStatus('');
    clearSuggestions();
    showRecipientPreview(recipient);
  }

  function notify(message, isError = false) {
    if (typeof window.showToast === 'function') {
      window.showToast(message, isError);
    }
  }

  function setModalOpen(isOpen) {
    modal.classList.toggle('is-open', isOpen);
    modal.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) setTimeout(() => confirmButton.focus(), 50);
  }

  function showRecipientPreview(recipient) {
    pendingRecipient = recipient.name;
    pendingPhoto = recipient.photo;
    pendingKnown = recipient.known;
    pendingBio = recipient.bio;
    modalName.textContent = recipient.name;
    modalPhoto.src = pendingPhoto;
    modalPhoto.alt = `${recipient.name} photo`;
    setModalOpen(true);
  }

  function confirmRecipient() {
    profileAvatar.src = pendingPhoto;
    profileAvatar.alt = pendingRecipient;
    profileName.textContent = pendingRecipient;
    profileBio.textContent = pendingBio;
    profileLabel.textContent = pendingKnown || 'Selected receiver';
    wishlistHeading.textContent = `${pendingRecipient}'s wishlist - choose a gift below.`;
    checkoutRecipient.value = pendingRecipient;
    profile.classList.add('is-visible');
    setModalOpen(false);

    document.getElementById('how').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  recipientForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = cleanName(recipientInput.value);
    if (name.length < 2) {
      setStatus('Enter the receiver name first.', true);
      notify('Enter the receiver name first', true);
      recipientInput.focus();
      return;
    }

    const recipient = findStoredRecipient(name);
    if (!recipient) {
      setStatus('Receiver not found. Please enter a name stored in the system.', true);
      notify('Receiver not found', true);
      recipientInput.focus();
      return;
    }

    recipientInput.value = recipient.name;
    setStatus('');
    clearSuggestions();
    showRecipientPreview(recipient);
  });

  recipientInput.addEventListener('input', () => {
    const query = cleanName(recipientInput.value);
    clearTimeout(searchTimer);
    clearSuggestions();

    if (!query) {
      setStatus('Start typing to see suggestions');
      return;
    }

    setStatus('Searching receiver records...');
    searchTimer = setTimeout(() => {
      renderSuggestions(query);
      if (getMatchingRecipients(query).length === 0) {
        setStatus('No matching receivers yet. Keep typing or try another name.', true);
        return;
      }
      setStatus('Select a matching receiver or press Continue.');
    }, 2000);
  });

  recipientSuggestions.addEventListener('click', (event) => {
    const suggestion = event.target.closest('[data-suggestion-index]');
    if (!suggestion) return;

    selectSuggestion(Number(suggestion.dataset.suggestionIndex));
  });

  confirmButton.addEventListener('click', confirmRecipient);

  cancelButton.addEventListener('click', () => {
    setModalOpen(false);
    recipientInput.focus();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      setModalOpen(false);
      recipientInput.focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      setModalOpen(false);
      recipientInput.focus();
    }
  });
})();
