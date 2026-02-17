import axios from "axios";
import "./style.css";

const API_KEY = "72b8da3f";
const BASE_URL = "https://www.omdbapi.com/";

const movieContainer = document.getElementById("movie-details");
const similarContainer = document.getElementById("similarMovies");

// Uzimamo ID iz URL-a
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

async function loadMovie() {
  if (!movieId) {
    movieContainer.innerHTML = "<p>Movie ID not found.</p>";
    return;
  }

  movieContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await axios.get(BASE_URL, {
      params: { apikey: API_KEY, i: movieId }
    });

    const movie = response.data;

    // ⭐ POSTAVI POZADINU NA POSTER FILMA
    if (movie.Poster && movie.Poster !== "N/A") {
      document.body.style.backgroundImage = `url(${movie.Poster})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundAttachment = "fixed";
    }

    movieContainer.innerHTML = `
      <div class="movie-container">
        <img src="${
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450?text=No+Image"
        }" />
        
        <div class="info">
          <h1>${movie.Title}</h1>
          <p><strong>Year:</strong> ${movie.Year}</p>
          <p><strong>Runtime:</strong> ${movie.Runtime}</p>
          <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
          <p><strong>Genre:</strong> ${movie.Genre}</p>
          <p><strong>Actors:</strong> ${movie.Actors}</p>
          <p><strong>Plot:</strong> ${movie.Plot}</p>
        </div>
      </div>
    `;

    // Učitaj slične filmove
    loadSimilarMovies(movie);

  } catch (err) {
    movieContainer.innerHTML = "<p>Error loading movie details.</p>";
  }
}

async function loadSimilarMovies(movie) {
  similarContainer.innerHTML = "<p>Loading...</p>";

  // Uzimamo prvi žanr
  const firstGenre = movie.Genre?.split(",")[0].trim();

  if (!firstGenre) {
    similarContainer.innerHTML = "<p>No similar movies found.</p>";
    return;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: { apikey: API_KEY, s: firstGenre }
    });

    const results = response.data.Search || [];

    // Filtriramo da izbacimo trenutni film
    const filtered = results
      .filter((m) => m.imdbID !== movieId)
      .slice(0, 6);

    if (filtered.length === 0) {
      similarContainer.innerHTML = "<p>No similar movies found.</p>";
      return;
    }

    similarContainer.innerHTML = "";

    filtered.forEach((sim) => {
      const poster =
        sim.Poster && sim.Poster !== "N/A"
          ? sim.Poster
          : "https://via.placeholder.com/300x450?text=No+Image";

      const card = document.createElement("div");
      card.className = "similar-card";

      card.innerHTML = `
        <img src="${poster}" alt="${sim.Title}">
        <h4>${sim.Title}</h4>
        <p>${sim.Year}</p>
      `;

    card.addEventListener("click", () => {
  window.open(`/kodehode/movie.html?id=${sim.imdbID}`, "_blank");
});


      similarContainer.appendChild(card);
    });

  } catch (err) {
    similarContainer.innerHTML = "<p>Error loading similar movies.</p>";
  }
}

loadMovie();
