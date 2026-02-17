import axios from "axios";
import "./style.css";

const API_KEY = "72b8da3f";
const BASE_URL = "https://www.omdbapi.com/";

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const autocomplete = document.getElementById("autocomplete");

// ------------------------------
// CENTRALNA FUNKCIJA ZA DROPDOWN
// ------------------------------
function hideDropdown() {
  autocomplete.style.display = "none";
  autocomplete.innerHTML = "";
}

// ------------------------------
// AUTOCOMPLETE LOGIKA
// ------------------------------
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (query.length < 2) {
    hideDropdown();
    return;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: { apikey: API_KEY, s: query }
    });

    const movies = response.data.Search || [];

    if (movies.length === 0) {
      hideDropdown();
      return;
    }

    autocomplete.innerHTML = "";
    autocomplete.style.display = "block";

    movies.slice(0, 5).forEach(movie => {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      item.textContent = movie.Title;

      item.addEventListener("click", () => {
        hideDropdown();
        window.open(`/movie-search-app/movie.html?id=${movie.imdbID}`, "_blank");


      });

      autocomplete.appendChild(item);
    });

  } catch (err) {
    hideDropdown();
  }
});

// ------------------------------
// KLIK VAN SEARCH CONTAINERA
// ------------------------------
document.addEventListener("click", (e) => {
  const searchContainer = document.querySelector(".search-container");

  if (!searchContainer.contains(e.target)) {
    hideDropdown();
  }
});

// ------------------------------
// KLIK NA INPUT → ZATVORI DROPDOWN
// ------------------------------
searchInput.addEventListener("click", () => {
  hideDropdown();
});

// ------------------------------
// KLIK NA SEARCH DUGME
// ------------------------------
searchBtn.addEventListener("click", () => {
  hideDropdown();
  searchMovies();
});

// ------------------------------
// ENTER → ZATVARA DROPDOWN + TRAŽI FILMOVE
// ------------------------------
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    hideDropdown();
    searchMovies();
  }
});

// ------------------------------
// GLAVNA FUNKCIJA ZA PRETRAGU
// ------------------------------
async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "<p>Searching...</p>";

  try {
    const response = await axios.get(BASE_URL, {
      params: { apikey: API_KEY, s: query }
    });

    if (response.data.Response === "False") {
      resultsDiv.innerHTML = `<p>${response.data.Error}</p>`;
      return;
    }

    const movies = response.data.Search || [];
    resultsDiv.innerHTML = "";

    for (const movie of movies) {
      const details = await axios.get(BASE_URL, {
        params: { apikey: API_KEY, i: movie.imdbID }
      });

      const info = details.data;

      const card = document.createElement("div");
      card.className = "movie-card";

      const poster =
        movie.Poster && movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/300x450?text=No+Image";

      card.innerHTML = `
        <img src="${poster}" alt="${movie.Title}">
        <h3>${movie.Title}</h3>

        <div class="year-runtime">
          <p>${movie.Year}</p>
          <p><strong>Runtime:</strong> ${info.Runtime}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        window.open(`/movie-search-app/movie.html?id=${movie.imdbID}`, "_blank");


      });

      resultsDiv.appendChild(card);
    }

  } catch (error) {
    console.error("Search error:", error);
    resultsDiv.innerHTML = "<p>Something went wrong. Try again.</p>";
  }
}
