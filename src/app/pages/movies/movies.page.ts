import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Movie, MovieService, ApiResult, Genre } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  movies: Movie[] = [];
  currentPage = 1;
  imageBaseUrl = environment.images;
  searchQuery = '';
  searchResults: Movie[] = [];
  genres: Genre[] = [];
  selectedGenreId: number | null = null;

  constructor(
    private movieService: MovieService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loadGenres();
    this.loadMovies();
  }

  // async loadGenres() {
  //   this.genres = [
  //     { id: 14, name: 'Fantasy' },
  //     { id: 28, name: 'Action' },
  //     { id: 12, name: 'Adventure' },
  //     { id: 878, name: 'Science Fiction' },
  //     { id: 16, name: 'Animation' },
  //     { id: 12, name: 'Adventure' },
  //     { id: 53, name: 'Thriller' },
  //     { id: 80, name: 'Crime' },
  //   ];
  // }
  async loadGenres() {
    this.movieService.getGenres().subscribe((res: Genre[]) => {
      this.genres = res;
    });
  }

  async loadMovies() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'circles',
    });
    await loading.present();

    this.movieService.getTopRatedMovies(this.currentPage).subscribe((res: ApiResult) => {
      loading.dismiss();
      this.movies = res.results;
    });
  }

  loadMore(event: any) {
    this.currentPage++;
    this.movieService.getTopRatedMovies(this.currentPage).subscribe((res: ApiResult) => {
      this.movies = this.movies.concat(res.results); // Gabungkan data baru ke array yang ada
      event.target.complete();
    });
  }


  searchMovies() {
    if (this.searchQuery.trim() !== '') {
      this.movieService.searchMovies(this.searchQuery).subscribe((res: ApiResult) => {
        this.searchResults = res.results;
      });
    } else {
      this.searchResults = [];
    }
  }

  filterByGenre() {
    if (this.selectedGenreId === null) {
      this.loadMovies();
    } else {
      this.movieService.getMoviesByGenre(this.selectedGenreId).subscribe((res: ApiResult) => {
        this.movies = res.results;
      });
    }
  }

  clearGenreSelection() {
    this.selectedGenreId = null;
    this.loadMovies();
  }

}
