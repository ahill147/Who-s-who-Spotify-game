import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game';
import { Howl } from 'howler';
import { Router } from '@angular/router';

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
  artistSongs: Track[];
  artistsArray: Artist[];
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  gameData!: GameData;
  winningArtist: Artist | undefined = undefined;
  playerSelectedArtist: Artist | undefined = undefined
  songs!: Track[];
  artists: Artist[] = [];

  currentSong: Howl | undefined = undefined
  currentPlayingSong: Track | undefined = undefined;
  selectedPreview: string = ''
  gameOver = false;
  isWinner = false;

  constructor(private gameService: GameService, private router: Router){}

  ngOnInit() {
    this.gameService.artistsArray.subscribe(artists => this.artists = artists);
    this.gameService.artistSongs.subscribe(songs => this.songs = songs);
    this.gameService.selectedArtist.subscribe(artist => this.winningArtist = artist);
    console.log('Game Service (Songs): ', this.songs)
    if(!this.artists.length) {
      const gameDataString = localStorage.getItem('gameData');
      if (gameDataString) {
        this.gameData = JSON.parse(gameDataString);
        this.winningArtist = this.gameData.winningArtist;
        this.songs = this.gameData.artistSongs;
        this.artists = this.gameData.artistsArray;
        console.log('Local Storage (songs): ', this.songs)
      }
      this.gameOver = false;
      this.isWinner = false;
    }
  }

  playSong(selectedSong: Track) {
    this.currentPlayingSong = selectedSong;
    this.selectedPreview = selectedSong?.preview
    this.playTracks()
  }

  playTracks() {
    this.currentSong = new Howl({
      src: [this.selectedPreview],
      html5: true,
      onend: () => {
        console.log('Finished')
      },
      onplayerror: (_, msg) => {
        console.log('Howl ERROR: ' + msg)
      }
    })

    this.currentSong.play()
  }

  stopSong() {
    this.currentSong?.stop()
  }

  onArtistSelected(artist: Artist) {
    this.playerSelectedArtist = artist;
  }

  checkAnswer() {
    this.stopSong()
    if (this?.playerSelectedArtist?.id === this?.winningArtist?.id) {
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
