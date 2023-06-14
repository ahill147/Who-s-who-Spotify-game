import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Artist {
  name: string;
  image: string;
}

interface Song {
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
  constructor(private router: Router) {}

  gameData!: GameData;
  currentArtist!: Artist;
  songs!: Song[];
  artists!: Artist[];

  currentPlayingSong: Song | null = null;
  gameOver = false;
  isWinner = false;

  ngOnInit() {
    const gameDataString = localStorage.getItem('gameData');
    if (gameDataString) {
      this.gameData = JSON.parse(gameDataString);
      this.currentArtist = this.gameData.winningArtist;
      this.songs = this.gameData.tracks;
      this.artists = this.gameData.allArtists;
    }
    this.gameOver = false;
    this.isWinner = false;
  } 

  playSong(song: Song) {
    this.currentPlayingSong = song;
  }

  onArtistSelected(artist: Artist) {
    this.currentArtist = artist;
  }

  checkAnswer() {
    console.log('Selected Artist:', this.currentArtist);
    console.log('Current Artist:', this.gameData.winningArtist);
  
    if (this.currentArtist.name === this.gameData.winningArtist.name) {
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
    this.router.navigate(['/']);
  }
}