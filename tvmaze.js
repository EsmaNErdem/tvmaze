"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


//get API data with input value
async function getShowsByTerm(term) {
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`)
  let showArr = res.data
  return showArr;
}

//creating list and makimg sure imgs load. 

//FURTHER STUDY FOR MYSELF TRY TO CATCH ERROR. 
function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
      if (show.show.image.original) {
        const $show = $(
          `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
           <div class="media">
             <img 
                src="${show.show.image.original}" class="w-25 mr-3" alt= "${show.show.name}" 
                alt="Bletchly Circle San Francisco" 
                class="w-25 mr-3">
             <div class="media-body">
               <h5 class="text-warning">${show.show.name}</h5>
               <div><small>${show.show.summary}</small></div>
               <button id ="delete-button" class="btn btn-outline-info btn-sm Show-getEpisodes">
                 Episodes
               </button>
             </div>
           </div>  
         </div>
        `);
        $showsList.append($show);
      } else {
        const $show = $(
          `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
           <div class="media">
             <img 
                src="${show.show.image.original}" class="w-25 mr-3" alt= "${show.show.name}" 
                alt="Bletchly Circle San Francisco" 
                class="w-25 mr-3">
             <div class="media-body">
               <h5 class="text-warning">${show.show.name}</h5>
               <div><small>${show.show.summary}</small></div>
               <button id ="delete-button" class="btn btn-outline-info btn-sm Show-getEpisodes">
                 Episodes
               </button>
             </div>
           </div>  
         </div>
        `);
        $showsList.append($show);
      }
    }
}


////adding submit event listener and with input value we fire up getShowsByTerm(term) to get the api data and creaing list with populateShows(shows) function;
async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


//getting api data creating obj with it. 
async function getEpisodesOfShow(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  return response.data.map(function(episode){

    return {
      id:episode.id,
      name:episode.name,
      season:episode.season,
      number:episode.number
    }
  })
}

//Here, we are emtpying the list as the first thing and while iteratig through episodes, we are creating li elements with API date
 function populateEpisodes(episodes) { 
  $("#episodes-list").empty();
  for (let episode of episodes) {
    const item = $(`<li>${episode.name}(season ${episode.season}, episode ${episode.number})</li>`);
    $("#episodes-list").append(item);
  }
  $episodesArea.show();
 }

//adding click event to epsiode button and this fires up getEpisodesOfShow(showId) and populateEpisodes(episodes)
$showsList.on("click","#delete-button", async function(e){
  //with this I was able leanr about data("show-id")
  const showId = $(e.target).closest(".Show").data("show-id");
  let episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
});

