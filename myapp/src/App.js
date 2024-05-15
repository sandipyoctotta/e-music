import React, { useState, useRef, useEffect } from "react";
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
        width: "100vw",
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
                  style={{
                    width: 350,
                    opacity: 0.5,
                  }}
                >
                  {/* <img src={song.coverpath} alt="song" /> */}
                  <span
                    style={{ marginLeft: 20, color: "#000", minWidth: "100%" }}
                    className="songName"
                  >
                    {song?.name}
                  </span>
                  {/* <span class="songlistplay">
                    <span class="timestamp">
                      {song?.size}
                      <i id="0" class="far songItemPlay fa-play-circle"></i>
                    </span>
                  </span> */}
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
        <div className="fadeIn">
          <h2>About Our Music Application</h2>
          <p>
            Welcome to our revolutionary music application, where we blend the
            power of blockchain technology with the convenience and
            accessibility of modern web development to create a seamless and
            innovative music experience.
          </p>
          <h3>The Web3 Component</h3>
          <p>
            At the heart of our application lies the Web3 component, powered by
            Ethereum blockchain. We have developed a smart contract that serves
            as the backbone of our music ecosystem. This smart contract allows
            for the minting, ownership, and trading of unique Non-Fungible
            Tokens (NFTs), each representing a piece of music stored securely on
            the InterPlanetary File System (IPFS).
          </p>
          <h3>The React.js Application</h3>
          <p>
            Our user-friendly React.js application provides an intuitive
            interface for users to interact with the blockchain-powered music
            ecosystem. Here's how it works:
          </p>
          <p>
            <strong>1. Upload Music to IPFS: </strong> Users can easily upload
            their music tracks to IPFS directly from our application. This
            ensures that the music files are stored in a decentralized and
            immutable manner.
            <br />
            <strong>2. Create Metadata: </strong> Upon uploading a music track,
            users are prompted to provide additional metadata such as the song
            name, artist information, album cover image, and any other relevant
            details.
            <br />
            <strong>3. Create JSON Metadata: </strong>After uploading the music
            and providing metadata, our application automatically creates a JSON
            file containing all the necessary information. This JSON file, along
            with the IPFS URL of the music track, is then uploaded to IPFS.
            <br />
            <strong>4. Mint NFTs: </strong>Using the IPFS hash of the JSON
            metadata file, users can mint unique NFTs representing their music
            tracks. These NFTs serve as certificates of ownership and can be
            bought, sold, or traded on our platform.
          </p>
          <br />
          <br />
          <h3>The Music Playback Experience</h3>
          <p>
            Once music tracks have been minted into NFTs and stored on the
            blockchain, users can explore and enjoy a vast collection of music
            through our application. Here's what you can do:
          </p>
          <p>
            <strong>1. Browse Minted Records: </strong>Our application retrieves
            all minted records from the smart contract deployed on the Ethereum
            blockchain. Users can browse through these records, each
            representing a unique music track.
          </p>

          <p>
            <strong>2. Listen to Music: </strong>
            Users can select a minted record and listen to the corresponding
            music track directly from our application. Our built-in audio player
            ensures a seamless playback experience, allowing users to enjoy
            their favorite tunes without interruption.
          </p>
          <p>
            <strong>3. Discover New Music: </strong>
            With a diverse range of music tracks available on our platform,
            users can discover new artists, genres, and trends. Our
            recommendation algorithms help users explore music that aligns with
            their tastes and preferences.
          </p>
          <p>
            In summary, our music application offers a revolutionary way to
            discover, share, and enjoy music in a decentralized and transparent
            manner. By leveraging blockchain technology and modern web
            development practices, we aim to redefine the music industry and
            empower artists and listeners alike. Join us on this exciting
            journey and experience the future of music today!`
          </p>

          <p style={{ marginTop: 50 }}>
            Copyright © 2024 Saswati Barik. All rights reserved.
          </p>
        </div>
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
    </div>
  );
};
export default App;
