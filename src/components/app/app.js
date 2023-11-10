import { Component } from "react";
import { Alert, Tabs } from "antd";
import { Offline, Online } from "react-detect-offline";
import { debounce } from "lodash";
import { GenresProvider } from "../genres-context";
import { RatingProvider } from "../rating-context";
import MovieDBService from "../../services/moviedb-service";
import "./app.css";
import SearchPage from "../search-page/search-page";
import RatedPage from "../rated-page/rated-page";

export default class App extends Component {
  movieDBService = new MovieDBService();

  state = {
    searchResults: [],
    loading: true,
    error: false,
    currentPage: 0,
    currentTab: "search",
    totalItems: 0,
    query: "Return",
  };

  // sessionId = "";

  genres = [];

  componentDidMount() {
    this.movieDBService.getGenres().then((genresData) => {
      this.genres = genresData;
    });

    // Getting some data to render
    this.getMovies(this.state.query, 1);

    // if (!localStorage.getItem("sessionId")) {
    //   this.movieDBService.createGuestSession().then((id) => {
    //     localStorage.setItem("sessionId", id);
    //   });
    // }
    // this.sessionId = localStorage.getItem("sessionId");

    if (!localStorage.getItem("ratedMovies")) {
      localStorage.setItem("ratedMovies", JSON.stringify([]));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      this.getMovies(this.state.query, 1);
    } else if (prevState.currentPage !== this.state.currentPage) {
      this.getMovies(this.state.query, this.state.currentPage);
    }
    // if (prevState.currentTab !== this.state.currentTab && this.state.currentTab === "rated") {
    //   this.movieDBService.getRatedMovies(this.sessionId, 1)
    //     .then(this.onDataLoaded).catch(this.onError);
    // }

    if (prevState.currentTab !== this.state.currentTab && this.state.currentTab === "search") {
      this.getMovies(this.state.query, 1);
    }
  }

  componentWillUnmount() {
    localStorage.clear();
  }

  onCurrentPageChange = (pageNum) => {
    this.setState({
      currentPage: pageNum,
    });
  };

  onTabChange = (key) => {
    this.setState({
      currentTab: key,
      loading: true,
    });
  };

  onAddRating = (value, movieId) => {
    // this.movieDBService.addRating(movieId, this.sessionId, value)
    //   .then(() => {
    //     localStorage.setItem(movieId, value);
    //     this.setState(({ searchResults }) => {
    //       const idx = searchResults.findIndex(({ id }) => id === movieId);
    //       const movie = searchResults[idx];
    //       const ratedMovie = { ...movie, rating: value };
    //       const newArray = [...searchResults.slice(0, idx),
    //         ratedMovie, ...searchResults.slice(idx + 1)];
    //       return {
    //         searchResults: newArray,
    //       };
    //     });
    //   });
    const idx = this.state.searchResults.findIndex(({ id }) => id === movieId);
    const movie = this.state.searchResults[idx];
    const ratedMovie = { ...movie, rating: value };
    localStorage.setItem(movieId, value);

    // Saving/Updating rated movie in Local storage
    const lsRatedMovies = JSON.parse(localStorage.getItem("ratedMovies"));
    if (!lsRatedMovies.find(({ id }) => id === movieId)) {
      localStorage.setItem("ratedMovies", JSON.stringify([...lsRatedMovies, ratedMovie]));
    } else {
      const lsMovieIdx = lsRatedMovies.findIndex(({ id }) => id === movieId);
      lsRatedMovies[lsMovieIdx].rating = value;
      localStorage.setItem("ratedMovies", JSON.stringify([...lsRatedMovies]));
    }

    this.setState(({ searchResults }) => {
      const newArray = [...searchResults.slice(0, idx),
        ratedMovie, ...searchResults.slice(idx + 1)];
      return {
        searchResults: newArray,
      };
    });
  };

  onDataLoaded = (data) => {
    this.setState({
      ...data,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onSearch = debounce((query) => {
    this.setState({
      query,
      loading: true,
    });
  }, 500);

  getMovies(query, page) {
    this.movieDBService.getMoviesFromPage(query, page)
      .then(this.onDataLoaded)
      .catch(this.onError);
  }

  render() {
    const { searchResults, loading, error, currentPage, totalItems,
      currentTab, query } = this.state;
    const ratedData = JSON.parse(localStorage.getItem("ratedMovies"));
    const hasData = !(error);
    const errorAlert = error ? (
      <Alert
        message="Error"
        description="Oops! Something went wrong"
        showIcon
        type="error"
      />
    ) : null;
    const content = currentTab === "search" ? (
      <SearchPage
        searchResults={searchResults}
        loading={loading}
        totalItems={totalItems}
        currentPage={currentPage}
        query={query}
        onSearch={this.onSearch}
        onCurrentPageChange={this.onCurrentPageChange}
        onAddRating={this.onAddRating}
      />
    ) : (
      <RatedPage
        ratedResults={ratedData}
        loading={loading}
        totalItems={ratedData.length}
        currentPage={currentPage}
        onCurrentPageChange={this.onCurrentPageChange}
        onAddRating={this.onAddRating}
      />
    );
    const dataView = hasData ? content : null;
    return (
      <>
        <Online>
          <Tabs
            centered
            defaultActiveKey="search"
            items={[{ label: "Search", key: "search" }, { label: "Rated", key: "rated" }]}
            onChange={this.onTabChange}
          />
          <GenresProvider value={this.genres}>
            <RatingProvider value={this.onAddRating}>
              {dataView}
            </RatingProvider>
          </GenresProvider>
          {errorAlert}
        </Online>
        <Offline>
          <Alert
            message="Network Connection Error"
            description="You're offline right now. Check your connection."
            showIcon
            type="error"
          />
        </Offline>
      </>
    );
  }
}
