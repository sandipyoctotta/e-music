import React, { useState, useRef, useEffect, useMemo } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepBackward,
  faPlayCircle,
  faPauseCircle,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import FileUploadButton from "./fileuploadbutton";
import Navigationbar from "./Navigationbar";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import contractABI from "./abi/MeMusic.json";
import song1 from "./Songs/1.mp3";
import song2 from "./Songs/2.mp3";
import song3 from "./Songs/3.mp3";
import song4 from "./Songs/4.mp3";
import song5 from "./Songs/5.mp3";
import song6 from "./Songs/6.mp3";
import song7 from "./Songs/7.mp3";
import song8 from "./Songs/8.mp3";

import cover1 from "./Images/cover1.jpeg";
import cover2 from "./Images/cover2.jpg";
import cover3 from "./Images/cover3.jpg";
import cover4 from "./Images/cover4.jpeg";
import cover5 from "./Images/cover5.jpg";
import cover6 from "./Images/cover6.jpeg";
import cover7 from "./Images/cover7.jpg";
import cover8 from "./Images/cover8.jpg";
import gifImage from "./Images/song gif.gif";
import metamask from "./Images/metamask.jpg";
import connectwallet from "./Images/connectwallet.jpg";
import { ethers } from "ethers";
import axios from "axios";

const App = () => {
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [song, setSongs] = useState([]);
  const audioRef = useRef(new Audio());
  const masterPlayRef = useRef(null);
  const progressBarRef = useRef(null);
  const gifRef = useRef(gifImage);
  const [about, setAbout] = useState(false);
  const [nftList, setNftList] = useState([]);

  useEffect(() => {
    fetchMintedNFTs();
  }, []);

  async function fetchMintedNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      "0x4752CdC1dFe7c5d213a65C91D2973663d6b7A4F8",
      contractABI.abi,
      provider
    );

    const nftid = [];
    let i = 1;
    let tokenExists = true;
    while (tokenExists) {
      try {
        const tokenURI = await contract.tokenURI(i);
        i++;
        nftid.push(tokenURI);
      } catch (e) {
        console.error(e);
        tokenExists = false;
      }
    }

    console.log(nftid);
    fetchJson(nftid);
  }

  const fetchJson = (nfts) => {
    Promise.all(nfts.map((x) => fetchPinataJson(x)))
      .then((res) => setNftList(res))
      .catch((err) => {
        console.error(err);
      });
  };

  async function fetchPinataJson(pinataUrl) {
    try {
      const response = await axios.get(
        `https://magenta-manual-platypus-51.mypinata.cloud/ipfs/${
          pinataUrl.split("//")[1]
        }`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Pinata JSON:", error);
      throw error;
    }
  }
  useEffect(() => {
    if (!nftList || !nftList.length) return;
    const audio = audioRef.current;
    audio.src = `https://magenta-manual-platypus-51.mypinata.cloud/ipfs/${
      nftList[songIndex].music.split("//")[1]
    }`;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [songIndex, isPlaying, nftList]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    if (songIndex < nftList.length - 1) {
      setSongIndex(songIndex + 1);
    }
  };

  const handlePreviousSong = () => {
    if (songIndex > 0) {
      setSongIndex(songIndex - 1);
    }
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const progressPercent = (currentTime / duration) * 100;
    setProgress(progressPercent || 0);
  };
  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });

  const btnhandler = () => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
    } else {
      alert("install metamask extension!!");
    }
  };
  const accountChangeHandler = (account) => {
    // Setting an address data
    setdata({
      address: account,
    });
  };
  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress || 0);
    const newTime = (newProgress / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const handleFileSelect = (file) => {
    const newSongIndex = song.length;
    const newSongs = [
      ...song,
      {
        songName: file.name,
        filepath: URL.createObjectURL(file),
        coverpath: "",
      },
    ];
    setSongs(newSongs);
    setSongIndex(newSongIndex);
    console.log("song selected", newSongs);
  };
  return data.address ? (
    <div
      style={{
        backgroundImage: `url(${require("./music1.jpg")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      {!about ? <FileUploadButton onFileSelect={handleFileSelect} /> : <></>}

      <div>
        <Navigationbar
          onClickHome={() => setAbout(false)}
          onClickAbout={() => setAbout(true)}
        />
      </div>

      {!about ? (
        <div>
          <div className="SongList" style={{ width: "100%" }}>
            <div
              className="songItemContainer"
              style={{
                overflow: "auto",
                width: "100%",
              }}
            >
              {nftList.map((song, index) => (
                <div
                  className="songItem"
                  key={index}
                  onClick={() => setSongIndex(index)}
                >
                  {/* <img src={song.coverpath} alt="song" /> */}
                  <span
                    style={{ marginRight: 20, color: "#FFF" }}
                    className="songName"
                  >
                    {song?.name}
                  </span>
                  <span class="songlistplay">
                    <span class="timestamp">
                      {song?.size}
                      <i id="0" class="far songItemPlay fa-play-circle"></i>
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="songInfo">
            <img src={gifRef.current} width="45px" alt="music" id="gif" />
            <span style={{ color: "#FFF" }} id="masterSongName">
              {nftList[songIndex]?.name}
            </span>
          </div>
        </div>
      ) : (
        <p className="fadeIn">
          {`A music app is a portal to a world of melodies, beats, and rhythms,
          right at your fingertips. It's not just an app; it's a gateway to
          emotions, memories, and creativity. With a music app, you can explore
          endless playlists curated to suit your mood, discover new artists and
          genres, and create personalized collections that reflect your unique
          taste. Whether you're looking to relax, get motivated, or simply
          groove to the rhythm, a music app transforms your device into a
          portable concert hall, ready to serenade you anytime, anywhere.`}
          <p style={{ marginTop: 50 }}>
            Copyright © 2024 Saswati Barik. All rights reserved.
          </p>
        </p>
      )}

      {!about ? (
        <div
          className="bottom-bar"
          style={{
            backgroundColor: "black",
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            marginTop: 20,
          }}
        >
          <input
            type="range"
            name="range"
            id="myProgressBar"
            min="0"
            value={progress}
            max="100"
            ref={progressBarRef}
            onChange={handleProgressChange}
            style={{ marginTop: "15px" }}
          />
          <div className="icons">
            <FontAwesomeIcon
              style={{ marginRight: 20 }}
              color={"#FFF"}
              icon={faStepBackward}
              size="2x"
              id="previous"
              onClick={handlePreviousSong}
            />
            <FontAwesomeIcon
              color={"#FFF"}
              icon={isPlaying ? faPauseCircle : faPlayCircle}
              size="2x"
              id="masterPlay"
              onClick={handlePlayPause}
              ref={masterPlayRef}
            />
            <FontAwesomeIcon
              style={{ marginLeft: 20 }}
              color={"#FFF"}
              icon={faStepForward}
              size="2x"
              id="next"
              onClick={handleNextSong}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <video
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        autoPlay
        loop
        muted
      >
        <source
          style={{ width: "100vw", height: "100vh" }}
          src={require("./Images/music.mp4")}
          type="video/mp4"
        />
      </video>
      <Card
        style={{
          border: "none",
          position: "absolute",
          left: "25vw",
          top: "15vh",
          paddingBottom: 50,
        }}
      >
        <Card.Header
          style={{
            border: "none",
            backgroundColor: "white",
            width: "50vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
          }}
        >
          <img
            src={connectwallet}
            // height={"30vh"}
            // width={"30vw"}
            alt="connectwallet"
            style={{
              marginRight: "10px",
              height: "30vh",
              objectFit: "contain",
            }}
          />
          <br></br>
          <br></br>
          <strong
            style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
          >
            Welcome to The Music Player
          </strong>
          <br></br>
          <strong>Connect wallet to get started</strong>
          <div style={{ marginTop: 30 }}>
            <Button
              onClick={btnhandler}
              variant="primary"
              style={{ width: 200 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={metamask}
                  height={30}
                  width={30}
                  alt="Metamask Logo"
                  style={{ marginRight: "10px" }}
                />
                Connect to wallet
              </div>
            </Button>
          </div>
        </Card.Header>
      </Card>
      {/* <img
        style={{ width: "100vw", height: "100vh" }}
        src={require("./Images/music.gif")}
        alt="loading..."
      /> */}
    </div>
  );
};
export default App;
