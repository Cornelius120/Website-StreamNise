document.addEventListener("DOMContentLoaded", () => {
  // =================================================================================
  // == DATA LAGU ==
  // == Silakan ubah, tambah, atau hapus data lagu di bawah ini. ==
  // == Anda bisa mengelola daftar ini langsung di file script.js di GitHub Anda. ==
  // =================================================================================
  const songsData = [
    {
      id: "song004",
      title: "Golden",
      artist: "KPop Demon Hunters",
      genre: "Pop",
      thumbnail: "https://cdn.imgpile.com/f/nsuYCbM_xl.jpg",
      src: [
        "https://vidcache.net:8161/static/ee2260b6005c7428f3c0659bf1c4be5a2a1c7c17/“Golden” Official Lyric Video ｜ KPop Demon Hunters ｜ Sony Animation.m4a",
      ],
    },
    {
      id: "song001",
      title: "Blue",
      artist: "Yung Kai",
      genre: "Pop",
      thumbnail: "https://cdn.imgpile.com/f/NccXLdF_xl.jpeg",
      src: [
        "https://vidcache.net:8161/static/f26d5a6ff1c61c43ae9d57f1303d1ca280eb4206/blue.mp3",
      ],
    },
    {
      id: "song002",
      title: "Way Back Home (feat. Conor Maynard) (Sam Feldt Edit)",
      artist: "Conor Maynard, Sam Feldt",
      genre: "Tropical house, Dance-Pop",
      thumbnail: "https://cdn.imgpile.com/f/ns4TfUW_xl.jpg",
      src: [
        "https://vidcache.net:8161/static/fedfd2167d06e19bf5e4a440f8d55037f6e28f50/Way Back Home (feat. Conor Maynard) (Sam Feldt Edit).mp3",
      ],
    },
    {
      id: "song003",
      title: "Thunderstruck",
      artist: "AC/DC",
      genre: "Rock",
      thumbnail: "https://cdn.imgpile.com/f/O3JZZZW_xl.png",
      src: [
        "https://vidcache.net:8161/static/57f2e2100840c5aeda1ab8b544516894a39f1f9e/Thunderstruck.mp3",
      ],
    },
  ];
  // =================================================================================
  // == AKHIR DARI DATA LAGU ==
  // =================================================================================

  // --- Elemen DOM ---
  const songListEl = document.getElementById("songList");
  const searchInput = document.getElementById("searchInput");
  const emptyStateEl = document.getElementById("emptyState");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const loopBtn = document.getElementById("loopBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const progressBar = document.getElementById("progressBar");
  const currentTimeEl = document.getElementById("currentTime");
  const totalDurationEl = document.getElementById("totalDuration");
  const playerThumbnail = document.getElementById("playerThumbnail");
  const playerTitle = document.getElementById("playerTitle");
  const playerArtist = document.getElementById("playerArtist");
  const viewAllBtn = document.getElementById("viewAllBtn");
  const viewBookmarksBtn = document.getElementById("viewBookmarksBtn");
  const toastEl = document.getElementById("toast");

  // --- State Aplikasi ---
  let audio = new Audio();
  let currentSongIndex = -1;
  let isPlaying = false;
  let isShuffled = true;
  let shuffledPlaylist = [];
  let currentVisiblePlaylist = [];
  let playHistory = [];
  let bookmarks =
    JSON.parse(localStorage.getItem("streamnise_bookmarks")) || [];
  let currentView = "all"; // 'all' atau 'bookmarks'

  // --- Fungsi Utama ---
  const shuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  const renderPlaylist = (playlist) => {
    songListEl.innerHTML = "";
    if (playlist.length === 0) {
      emptyStateEl.classList.remove("hidden");
      return;
    }
    emptyStateEl.classList.add("hidden");

    playlist.forEach((song) => {
      const isBookmarked = bookmarks.includes(song.id);
      const songCard = document.createElement("div");
      songCard.className = `song-card bg-[#181818] p-4 rounded-lg flex flex-col gap-4 cursor-pointer hover:bg-[#282828] transition-colors duration-300 group`;
      songCard.dataset.songId = song.id;

      songCard.innerHTML = `
                <div class="relative">
                    <img src="${song.thumbnail}" alt="${
        song.title
      }" class="w-full h-auto aspect-square rounded-md object-cover" loading="lazy">
                    <button class="play-song-btn absolute bottom-2 right-2 bg-[#1DB954] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300 transform hover:scale-110">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4.018 15.59a1 1 0 001.427.822l11.026-6.5a1 1 0 000-1.644L5.445 1.768a1 1 0 00-1.427.822v13z"/></svg>
                    </button>
                </div>
                <div>
                    <h3 class="font-bold text-white truncate">${song.title}</h3>
                    <p class="text-sm text-gray-400 truncate">${song.artist}</p>
                    <div class="flex justify-between items-center mt-2">
                         <span class="text-xs bg-gray-700 px-2 py-1 rounded-full">${
                           song.genre
                         }</span>
                         <div class="flex gap-3">
                            <button class="bookmark-btn text-gray-500 hover:text-white" title="Bookmark">
                                <svg class="w-5 h-5 ${
                                  isBookmarked
                                    ? "fill-current text-[#1DB954]"
                                    : "fill-none"
                                }" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                            </button>
                            <button class="permalink-btn text-gray-500 hover:text-white" title="Salin Link">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

      songCard
        .querySelector(".play-song-btn")
        .addEventListener("click", (e) => {
          e.stopPropagation();
          const songToPlay = currentVisiblePlaylist.find(
            (s) => s.id === song.id
          );
          const playlistIndex = currentVisiblePlaylist.indexOf(songToPlay);
          loadAndPlaySong(playlistIndex);
        });
      songCard.querySelector(".bookmark-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleBookmark(song.id, e.currentTarget);
      });
      songCard
        .querySelector(".permalink-btn")
        .addEventListener("click", (e) => {
          e.stopPropagation();
          copyPermalink(song.id);
        });

      songListEl.appendChild(songCard);
    });
  };

  const loadAndPlaySong = (index) => {
    if (index < 0 || index >= currentVisiblePlaylist.length) return;

    const oldCard = document.querySelector(`.song-card.bg-green-900\\/50`);
    if (oldCard) oldCard.classList.remove("bg-green-900/50");

    if (currentSongIndex !== index) {
      playHistory.push(currentSongIndex);
    }

    currentSongIndex = index;
    const song = currentVisiblePlaylist[currentSongIndex];

    playerThumbnail.src = song.thumbnail;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;

    tryLoadSource(song.src, 0);

    const newCard = document.querySelector(
      `.song-card[data-song-id="${song.id}"]`
    );
    if (newCard) newCard.classList.add("bg-green-900/50");
  };

  const tryLoadSource = (sources, index) => {
    if (index >= sources.length) {
      console.error("Semua link sumber untuk lagu ini gagal dimuat.");
      playNext();
      return;
    }
    audio.src = sources[index];
    audio.load();
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then((_) => play())
        .catch((error) => {
          console.warn(`Gagal memutar sumber ${index}:`, error);
          tryLoadSource(sources, index + 1);
        });
    }
  };

  audio.onerror = () => {
    console.error("Audio error:", audio.error);
    const song = currentVisiblePlaylist[currentSongIndex];
    const currentSourceIndex = song.src.indexOf(audio.currentSrc);
    tryLoadSource(song.src, currentSourceIndex + 1);
  };

  const play = () => {
    isPlaying = true;
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
    audio.play();
  };

  const pause = () => {
    isPlaying = false;
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    audio.pause();
  };

  const playNext = () => {
    let nextIndex;
    if (currentVisiblePlaylist.length === 0) return;

    if (currentView === "bookmarks" || !isShuffled) {
      nextIndex = (currentSongIndex + 1) % currentVisiblePlaylist.length;
    } else {
      nextIndex = Math.floor(Math.random() * currentVisiblePlaylist.length);
      if (nextIndex === currentSongIndex && currentVisiblePlaylist.length > 1) {
        nextIndex = (nextIndex + 1) % currentVisiblePlaylist.length;
      }
    }
    loadAndPlaySong(nextIndex);
  };

  const playPrev = () => {
    if (playHistory.length > 0) {
      const prevIndex = playHistory.pop();
      if (prevIndex !== -1 && prevIndex < currentVisiblePlaylist.length) {
        currentSongIndex = prevIndex;
        loadAndPlaySong(currentSongIndex);
        playHistory.pop();
      } else {
        playNext();
      }
    } else {
      playNext();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const updateProgress = () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    if (isFinite(audio.duration)) {
      totalDurationEl.textContent = formatTime(audio.duration);
    }
  };

  const toggleBookmark = (songId, buttonEl) => {
    const index = bookmarks.indexOf(songId);
    const svg = buttonEl.querySelector("svg");
    if (index > -1) {
      bookmarks.splice(index, 1);
      svg.classList.remove("fill-current", "text-[#1DB954]");
      svg.classList.add("fill-none");
    } else {
      bookmarks.push(songId);
      svg.classList.add("fill-current", "text-[#1DB954]");
      svg.classList.remove("fill-none");
    }
    localStorage.setItem("streamnise_bookmarks", JSON.stringify(bookmarks));
    if (currentView === "bookmarks") filterAndRender();
  };

  const copyPermalink = (songId) => {
    const url = new URL(window.location);
    url.hash = songId;
    navigator.clipboard.writeText(url.href).then(() => {
      toastEl.classList.remove("opacity-0");
      setTimeout(() => toastEl.classList.add("opacity-0"), 2000);
    });
  };

  const handlePermalink = () => {
    if (window.location.hash) {
      const songId = window.location.hash.substring(1);
      const songCard = document.querySelector(
        `.song-card[data-song-id="${songId}"]`
      );
      if (songCard) {
        songCard.scrollIntoView({ behavior: "smooth", block: "center" });
        songCard.classList.add("highlight");
      }
    }
  };

  const filterAndRender = () => {
    const searchTerm = searchInput.value.toLowerCase();
    let sourcePlaylist =
      currentView === "all"
        ? shuffledPlaylist
        : songsData
            .filter((s) => bookmarks.includes(s.id))
            .sort((a, b) => bookmarks.indexOf(a.id) - bookmarks.indexOf(b.id));

    currentVisiblePlaylist = searchTerm
      ? sourcePlaylist.filter(
          (song) =>
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        )
      : sourcePlaylist;

    renderPlaylist(currentVisiblePlaylist);
  };

  const switchView = (view) => {
    currentView = view;
    playHistory = [];
    currentSongIndex = -1;

    if (view === "all") {
      viewAllBtn.classList.replace("bg-[#282828]", "bg-[#1DB954]");
      viewBookmarksBtn.classList.replace("bg-[#1DB954]", "bg-[#282828]");
    } else {
      viewBookmarksBtn.classList.replace("bg-[#282828]", "bg-[#1DB954]");
      viewAllBtn.classList.replace("bg-[#1DB954]", "bg-[#282828]");
    }
    filterAndRender();
  };

  playPauseBtn.addEventListener("click", () => (isPlaying ? pause() : play()));
  nextBtn.addEventListener("click", playNext);
  prevBtn.addEventListener("click", playPrev);
  loopBtn.addEventListener("click", () => {
    audio.loop = !audio.loop;
    loopBtn.classList.toggle("icon-active", audio.loop);
  });
  shuffleBtn.addEventListener("click", () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle("icon-active", isShuffled);
  });
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => {
    if (!audio.loop) playNext();
  });
  progressBar.addEventListener("input", (e) => {
    if (isFinite(audio.duration)) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    }
  });
  searchInput.addEventListener("input", filterAndRender);
  viewAllBtn.addEventListener("click", () => switchView("all"));
  viewBookmarksBtn.addEventListener("click", () => switchView("bookmarks"));
  window.addEventListener("load", handlePermalink);

  const init = () => {
    shuffledPlaylist = shuffleArray([...songsData]);
    switchView("all");
    handlePermalink();
  };

  init();
});
