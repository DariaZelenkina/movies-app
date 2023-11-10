export default class MovieDBService {
  apiBase = "https://api.themoviedb.org/3";

  options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDUwZTk2MWZkMTE2NjhjMmIxYjg5M2I1NTRjMWRiNCIsInN1YiI6IjY1MzhjMjA3NDFhYWM0MDBlMDQwYjY3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EbpnRYpfWT5bNeUA9ImMFL6Nf_1s1FiIPdcGT43UfWE",
    },
  };

  async getResource(url, options = this.options) {
    const res = await fetch(`${this.apiBase}${url}`, options);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    const body = await res.json();
    return body;
  }

  async createGuestSession() {
    const res = await this.getResource('/authentication/guest_session/new');
    return res.guest_session_id;
  }

  async getGenres() {
    const res = await this.getResource('/genre/movie/list');
    return res.genres.map(this.transformGenresData);
  }

  async getMoviesFromPage(query, pageNum) {
    const res = await this.getResource(`/search/movie?query=${query}&page=${pageNum}`);
    const movies = res.results.map(this.transformMovieData);
    return {
      searchResults: movies,
      query,
      currentPage: res.page,
      totalItems: res.total_results,
    };
  }

  async getRatedMovies(guestSessionId, pageNum) {
    const res = await this.getResource(`/guest_session/${guestSessionId}/rated/movies?page=${pageNum}`);
    const movies = res.results.map(this.transformMovieData);
    return {
      ratedResults: movies,
      currentPage: res.page,
      totalItems: res.total_results,
    };
  }

  async addRating(movieId, guestSessionId, rating) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        "Content-Type": 'application/json;charset=utf-8',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDUwZTk2MWZkMTE2NjhjMmIxYjg5M2I1NTRjMWRiNCIsInN1YiI6IjY1MzhjMjA3NDFhYWM0MDBlMDQwYjY3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EbpnRYpfWT5bNeUA9ImMFL6Nf_1s1FiIPdcGT43UfWE',
      },
      body: `{"value":${rating}}`,
    };
    await this.getResource(`/movie/${movieId}/rating?guest_session_id=${guestSessionId}`, options);
  }

  transformMovieData(item) {
    const posterBaseUri = "https://image.tmdb.org/t/p/original";
    const posterPath = item.poster_path === null ? "" : posterBaseUri + item.poster_path;
    const rating = localStorage.getItem(item.id) ? parseFloat(localStorage.getItem(item.id)) : 0;
    return {
      id: item.id,
      title: item.title,
      date: item.release_date,
      genreIds: item.genre_ids,
      description: item.overview,
      poster: posterPath,
      averageRating: item.vote_average,
      // rating: item.rating ? item.rating : 0,
      rating,
    };
  }

  transformGenresData(item) {
    return {
      id: item.id,
      name: item.name,
    };
  }
}
