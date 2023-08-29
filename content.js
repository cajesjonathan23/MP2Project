async function createImageSlider() {
  try {
    const response = await fetch("https://www.dbooks.org/api/recent");
    const data = await response.json();

    const booksToShow = data.books;

    const sliderWrapper = document.getElementById("sliderWrapper");

    booksToShow.forEach(book => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");

      const card = document.createElement("div");
      card.classList.add("card", "custom-card");
      card.addEventListener("click", () => {
        redirectToEbookPage(book.id); // Call redirectToEbookPage when card is clicked
      });

      const img = document.createElement("img");
      img.src = book.image;
      img.alt = book.title;
      img.classList.add("card-img-top", "resize");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const title = document.createElement("h5");
      title.classList.add("card-title");
      title.textContent = "Title: " + book.title;

      cardBody.appendChild(title);

      card.appendChild(img);
      card.appendChild(cardBody);

      slide.appendChild(card);
      sliderWrapper.appendChild(slide);
    });

    new Swiper(".swiper-container", {
      slidesPerView: 3,
      spaceBetween: 10,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function redirectToEbookPage(id) {
  sessionStorage.setItem("selectedBookId", id);
  window.location.href = "ebook.html";
}

window.addEventListener("DOMContentLoaded", createImageSlider);


//Movies
const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
   
    apiKey: "e76d2381f0382657b3c2960253bbd771",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};
async function fetchAPIData(endpoint) {
  try {
    const response = await fetch(global.api.apiUrl + endpoint + "?api_key=" + global.api.apiKey);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching API data:", error);
    throw error;
  }
}


async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}"> <!-- Add this anchor tag -->
        ${
          movie.poster_path
            ? `<img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}"
        />`
            : `<img
        src="../images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}"
      />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>
    `;

    // Add an event listener to the anchor tag for each movie card
    const anchorTag = div.querySelector("a");
    anchorTag.addEventListener("click", (event) => {
      // Prevent the default link behavior
      event.preventDefault();
      
      // Redirect to the movie-details.html page with the appropriate query parameter
      const movieId = movie.id;
      window.location.href = `movie-details.html?id=${movieId}`;
    });

    document.querySelector("#popular-movies").appendChild(div);
  });
}
displayPopularMovies();

async function fetchMovieDetails(movieId) {
  const endpoint = `movie/${movieId}`;
  try {
    const data = await fetchAPIData(endpoint);
   
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}
