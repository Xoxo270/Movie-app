import "dotenv/config";

const API_KEY = process.env.API_KEY;
console.log(API_KEY);
///////////////////////////////////////////////////////////////////////////////////////////
// Selectors
let movies = document.getElementById("movieList");
let menuContent = document.querySelectorAll(".dropdown-content");
let menuCntt = document.querySelector(".dropdown-content");
let dropdownMenu = document.querySelector(".menu");
let searchField = document.querySelector(".searchField");

///////////////////////////////////////////////////////////////////////////////////////////
// Show trending movies and series on page load

window.addEventListener("load", () => {
  let request = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`;

  fetchMovie(request);
});

// Async function to get movie details from the API
const fetchMovie = (url) => {
  try {
    fetch(url)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        showMovies(data.results);
      });
  } catch (error) {
    console.error(`Error message : ${error.message}`);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Foreach function to show movie infos
const showMovies = (data) => {
  movies.innerHTML = "";
  if (data.length < 1) {
    let noResults = `<div class="movie flex nores"> No results for : ${searchField.value} </div>`;
    movies.insertAdjacentHTML("beforeend", noResults);
  } else {
    for (let i = 0; i < data.length; i++) {
      let html = `
       <div class="movie flex">      
       ${
         data[i].title
           ? `<p class="movieTitle flex">${data[i].title}</p>`
           : `<p class="movieTitle flex">${data[i].name}</p>`
       }
       <img class="poster"
       src="https://image.tmdb.org/t/p/original${data[i].poster_path}"
       alt=""
       />
       <div class="infos">
       <p class="rating"> &#11088 ${data[i].vote_average} / 10 (${
         data[i].vote_count
       })</p>
       <p class="summary">
       "${data[i].overview}"
       </p>
       </div>
       </div>`;

      movies.insertAdjacentHTML("beforeend", html);
    }
  }
  searchField.value = "";
};

///////////////////////////////////////////////////////////////////////////////////////////
// Burger menu hover function

dropdownMenu.addEventListener("mouseover", () => {
  menuContent[0].style.display = "block";
});
dropdownMenu.addEventListener("mouseout", () => {
  menuContent[0].style.display = "none";
});

///////////////////////////////////////////////////////////////////////////////////////////
// Change movie list based on the clicked menu category

let menu = (event) => {
  let menuObj = {
    topRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`,
    popular: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
    trending: `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`,
    nowPlaying: `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`,
    upcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`,
  };
  let compare = event.target.classList[0];
  fetchMovie(menuObj[compare]);
};
menuCntt.addEventListener("click", menu);

///////////////////////////////////////////////////////////////////////////////////////////
// Searchbar function

let searchFnc = (event) => {
  if (event.keyCode === 13) {
    let arraySearch = searchField.value.replace(/ /g, "+").toLowerCase();
    let requestUrl = `https://api.themoviedb.org/3/search/movie?query=${arraySearch}&api_key=${API_KEY}`;
    fetchMovie(requestUrl);
  }
};
searchField.addEventListener("keydown", searchFnc);
