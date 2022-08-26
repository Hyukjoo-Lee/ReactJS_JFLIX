const API_KEY = "6a775266b4bb807f408dc64151848fcc";
// const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";
const REGION = "ca";
const LANG = "en-US";
const PAGE = "1";

export interface ITvShows {
  id: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  first_air_date: string;
  name?: string;
  vote_average: string;
}

export interface IGetTvShows {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ITvShows[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvShowsDetail {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    original_title: string;
    overview: string;
    vote_average: number;
    release_date: string;
    
    genres: [
      {
        id: number;
        name: string;
      }
    ];
    tagline: string;
  }

  
export interface IGetTvShowsVideo {
    id: string,
    results: [
      {
        name: string,
        key: string,
        official: true,
      }
    ]
  }

//   https://api.themoviedb.org/3/tv/on_the_air?api_key=6a775266b4bb807f408dc64151848fcc&language=en-US&page=1

export async function getTvShows(kind: string) {
    return await (
      await fetch(
        `${BASE_PATH}/tv/${kind}?api_key=${API_KEY}&language=${LANG}&page=${PAGE}&region=${REGION}`
      )
    ).json();
  }

export async function getTvShowsDetail(id: string) {
    return await (
      await fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}&language=${LANG}`)
    ).json();
  }

export async function getTvShowsVideo(id: string) {
    return await (
      await fetch(
        `${BASE_PATH}/tv/${id}/videos?api_key=${API_KEY}&language=${LANG}`
      )
    ).json();
  }

