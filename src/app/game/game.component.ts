import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Howl } from 'howler';
import { GameService } from 'src/services/game';

interface Artist {
  id?: string;
  name: string;
  image: string;
}

interface Track {
  id?: number;
  artistId?: string;
  name: string;
  preview: string;
}

interface GameData {
  winningArtist: Artist;
  tracks: Track[];
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
  songs!: Track[];
  artists: Artist[] = [];

  currentSong: Howl | undefined = undefined
  currentPlayingSong: Track | undefined = undefined;
  selectedPreview: string = ''
  gameOver = false;
  isWinner = false;

  constructor(private gameService: GameService, private router: Router){}

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

  stopSong() {
    this.currentSong?.stop()
  }

  onArtistSelected(artist: Artist) {
    this.currentArtist = artist;
  }

  checkAnswer() {
    console.log('Selected Artist:', this.currentArtist);
    console.log('Current Artist:', this.gameData.winningArtist);

    if (this?.currentArtist?.name === this.gameData.winningArtist.name) {
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
