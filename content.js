//Recently Added Books
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
        

          const img = document.createElement("img");
          img.src = book.image;
          img.alt = book.title;
          img.classList.add("card-img-top", "resize");

          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");

          const title = document.createElement("h5");
          title.classList.add("card-title");
          title.textContent = "Title: " + book.title;

          // const author = document.createElement("p");
          // author.classList.add("card-text");
          // author.textContent = "Author: " + book.authors;

          // More card content creation...

          cardBody.appendChild(title);
          // cardBody.appendChild(author);

          card.appendChild(img);
          card.appendChild(cardBody);

          slide.appendChild(card);
          sliderWrapper.appendChild(slide);
      });

      new Swiper(".swiper-container", {
        slidesPerView: 3, // Display 3 slides per view
        spaceBetween: 10, // Space between slides
        loop: true, // Loop the slider
        navigation: {
            nextEl: ".swiper-button-next", // Next button selector
            prevEl: ".swiper-button-prev", // Previous button selector
        },
       
        breakpoints: {
            768: {
                slidesPerView: 2, // Number of slides per view on screens wider than 768px
            },
            1024: {
                slidesPerView: 3, // Number of slides per view on screens wider than 1024px
            },
        },
    });
    
  } catch (error) {
      console.error("Error fetching data:", error);
  }
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
    // Register your key at https://www.themoviedb.org/settings/api and enter here
    // Only use this for development or very small projects. You should store your key and make requests from a server
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

// Display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
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

    document.querySelector("#popular-movies").appendChild(div);
  });
}
displayPopularMovies();

