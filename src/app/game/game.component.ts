// import { Component, OnInit, Input } from '@angular/core';
// import { Artist, Track } from '../home/home.component';
// import { Howl, Howler } from 'howler';

// @Component({
//   selector: 'app-game',
//   templateUrl: './game.component.html',
//   styleUrls: ['./game.component.css']
// })
// export class GameComponent implements OnInit {
//   @Input() artists: Artist[] = [];
//   @Input() songs: Track[] = [];


//   currentSong: Howl | undefined;
//   selectedArtist: Artist | undefined;
//   gameOver: boolean = false;
//   isWinner: boolean = false;
//   currentPlayingSong: Track | undefined;

//   artistsArray: Artist[] = [];
//   artistSongs: Track[] = [];
//   selectedSong: Track | undefined = undefined;
//   selectedPreview: string = '';

//   playSong(song: Track) {
//     this.stopCurrentSong();
  
//     this.currentSong = new Howl({
//       src: [song.preview],
//       html5: true,
//       onend: () => {
//         console.log('Finished');
//       },
//       onplayerror: (_, msg) => {
//         console.log('Howl ERROR: ' + msg);
//       },
//     });
  
//     this.currentPlayingSong = song;
//     this.currentSong.play();
//   }
  
//   stopSong(song: Track) {
//     if (this.currentPlayingSong && this.currentPlayingSong === song) {
//       this.currentSong?.stop();
//       this.currentSong = undefined;
//       this.currentPlayingSong = undefined;
//     }
//   }

//   private stopCurrentSong() {
//     if (this.currentSong && this.currentSong.playing()) {
//       this.currentSong.stop();
//       this.currentSong = undefined;
//       this.currentPlayingSong = undefined;
//     }
//   }

//   checkAnswer(artist: Artist, song: Track) {
//     if (artist.id === song.artistId) {
//       this.isWinner = true;
//     } else {
//       this.isWinner = false;
//     }
//     this.gameOver = true;
//     this.stopCurrentSong();
//   }

//   restartGame() {
//     // this.gameOver = false;
//     // this.isWinner = false;
//     // this.stopCurrentSong();
//     localStorage.removeItem('gameData');
//     this.ngOnInit();
//   }

//   setSong(selectedSong: Track) {
//     this.selectedSong = selectedSong;
//     this.selectedPreview = selectedSong?.preview
//   }

//   onSubmit() {
//     const obj = {
//       winningArtist: this.selectedArtist,
//       tracks: this.artistSongs,
//       allArtists: this.artistsArray
//     }
//     localStorage.setItem('gameData', JSON.stringify(obj))
//   }

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';

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
