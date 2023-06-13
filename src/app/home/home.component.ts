import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { Howl, Howler } from 'howler';

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

interface Artist {
  id: string,
  name: string
}

interface Track {
  id: number
  artistId: string,
  name: string
  preview: string
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})

export class HomeComponent implements OnInit {
  constructor() { }

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: String = "";
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";
  testArray: Artist[] = [];
  artistSongs: Track[] = [];
  selectedArtist: Artist | undefined = undefined;
  selectedSong: Track | undefined = undefined;
  selectedPreview: string = ''
  currentSong: Howl | undefined = undefined
  trackNumber: number = 0

  ngOnInit(): void {
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    this.genres = response.genres;
    this.configLoading = false;
  };

  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
    console.log(this.selectedGenre);
    console.log(TOKEN_KEY);
    this.printArtistData(this.token, selectedGenre)
  }

  printArtistData = async (t: any, genre: string) => {
    // fetching by arti and storing within
    const res = await fetchFromSpotify({
      token: t,
      endpoint: `search?q=genre:${genre}&type=artist&limit=30`
    })
    const artistArray = res.artists.items.map((item: any) => {
      return {
        id: item.id,
        name: item.name
      }
    })
    this.testArray = artistArray;
  }

  setArtist(selectedArtist: Artist) {
    this.selectedArtist = selectedArtist;
    this.getArtistTracks(this.token, selectedArtist.id)
  }

  getArtistTracks = async (t: any, artistId: string) => {
    const res = await fetchFromSpotify({
      token: t,
      endpoint: `artists/${artistId}/top-tracks?market=US`
    });
    const data = res.tracks.map((track: any, index: number) => {
      return {
        id: index + 1,
        artistId: track.artists[0].id,
        name: track.name,
        preview: track.preview_url
      }
    })
    console.log(data)
    this.artistSongs = data
  }

  setSong(selectedSong: Track) {
    this.selectedSong = selectedSong;
    this.selectedPreview = selectedSong?.preview
  }

  playSong() {
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
    console.log(this.currentSong)

    this.currentSong.play()
  }

  stopSong() {
    this.currentSong?.stop()
  }

}
