import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game';

interface Artist {
  id?: string;
  name: string;
  image: string;
}

interface Song {
  id?: number;
  artistId?: string;
  name: string;
  preview: string;
}

interface GameData {
  winningArtist: Artist;
  tracks: Song[];
  allArtists: Artist[];
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  gameData!: GameData;
  currentArtist: Artist | undefined = undefined;
  songs!: Song[];
  artists: Artist[] = [];

  currentPlayingSong: Song | null = null;
  gameOver = false;
  isWinner = false;

  constructor(private gameService: GameService){}

  ngOnInit() {
    this.gameService.artistsArray.subscribe(artists => this.artists = artists);
    this.gameService.artistSongs.subscribe(songs => this.songs = songs);
    this.gameService.selectedArtist.subscribe(artist => this.currentArtist = artist);
    console.log(this.songs)
    if(!this.artists.length) {
      const gameDataString = localStorage.getItem('gameData');
      if (gameDataString) {
        this.gameData = JSON.parse(gameDataString);
        this.currentArtist = this.gameData.winningArtist;
        this.songs = this.gameData.tracks;
        this.artists = this.gameData.allArtists;
        console.log(this.songs)
      }
      this.gameOver = false;
      this.isWinner = false;
    }
  }

  playSong(song: Song) {
    this.currentPlayingSong = song;
    console.log(this.currentPlayingSong)
  }

  onArtistSelected(artist: Artist) {
    this.currentArtist = artist;
  }

  checkAnswer(artist: Artist) {
    if (artist === this.currentArtist) {
      this.gameOver = true;
      this.isWinner = true;
    } else {
      this.gameOver = true;
      this.isWinner = false;
    }
  }

  restartGame() {
    localStorage.removeItem('gameData');
    this.ngOnInit();
  }
}
