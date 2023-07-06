import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
export interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  // Add more properties as needed
}

export interface ApiResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  getTopRatedMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${environment.baseUrl}/movie/popular?api_key=${environment.apiKey}&page=${page}`);
  }

  getMovieDetails(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${environment.baseUrl}/movie/${id}?api_key=${environment.apiKey}`);
  }

  searchMovies(query: string): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${environment.baseUrl}/search/movie?api_key=${environment.apiKey}&query=${query}`);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${environment.baseUrl}/genre/movie/list?api_key=${environment.apiKey}`).pipe(
      map((response: any) => response.genres)
    );
  }

  getMoviesByGenre(genreId: number): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${environment.baseUrl}/discover/movie?api_key=${environment.apiKey}&with_genres=${genreId}`);
  }
}
