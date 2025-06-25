const gallery = document.getElementById('dogGallery');
const refreshBtn = document.getElementById('refreshBtn');
const breedInput = document.getElementById('breedInput');

let breedMap = {}; // maps "golden retriever" => "retriever/golden"

async function loadBreedList() {
  const res = await fetch('https://dog.ceo/api/breeds/list/all');
  const data = await res.json();
  const breeds = data.message;

  for (const breed in breeds) {
    if (breeds[breed].length === 0) {
      breedMap[breed] = breed; // e.g., "beagle"
    } else {
      breeds[breed].forEach(sub => {
        const key = `${sub} ${breed}`; // e.g., "golden retriever"
        breedMap[key] = `${breed}/${sub}`; // → "retriever/golden"
      });
    }
  }
}

async function fetchDogs(input = "") {
  let path = "";
  if (input) {
    const formatted = input.toLowerCase().trim();
    if (breedMap[formatted]) {
      path = `https://dog.ceo/api/breed/${breedMap[formatted]}/images/random/5`;
    } else {
      gallery.innerHTML = `<p>No results found for "${input}".</p>`;
      return;
    }
  } else {
    path = `https://dog.ceo/api/breeds/image/random/5`;
  }

  try {
    const res = await fetch(path);
    const data = await res.json();

    if (data.status === "success") {
      displayDogs(data.message);
    } else {
      gallery.innerHTML = `<p>No results found for "${input}".</p>`;
    }
  } catch {
    gallery.innerHTML = `<p>Failed to fetch dogs. Try again later.</p>`;
  }
}

function displayDogs(images) {
  gallery.innerHTML = '';
  images.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    gallery.appendChild(img);
  });
}

// Event Listeners
refreshBtn.addEventListener('click', () => {
  fetchDogs(breedInput.value);
});

breedInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    fetchDogs(breedInput.value);
  }
});

// On Load
loadBreedList().then(fetchDogs);
