import './App.css';
import React, { useEffect } from 'react';

const firstSoundsGroup = [
  {
    keyCode: 81,
    key: 'Q',
    id: 'Rock Kick',
    url: require('./sounds/rockKick.wav'),
  },
  {
    keyCode: 87,
    key: 'W',
    id: 'Rock Snare',
    url: require('./sounds/rockSnare.wav')
  },
  {
    keyCode: 69,
    key: 'E',
    id: 'Rock Hat',
    url: require('./sounds/rockHat.wav')
  },
  {
    keyCode: 65,
    key: 'A',
    id: '808 Kick',
    url: require('./sounds/808_Kick.wav')
  },
  {
    keyCode: 83,
    key: 'S',
    id: '808 Snare',
    url: require('./sounds/808_Snare.wav')
  },
  {
    keyCode: 68,
    key: 'D',
    id: '808 HiHat',
    url: require('./sounds/808_Hat.wav')
  },
  {
    keyCode: 90,
    key: 'Z',
    id: "Infinity Kick",
    url: require('./sounds/Infinity_Kick.wav')
  },
  {
    keyCode: 88,
    key: 'X',
    id: 'Infinity Snare',
    url: require('./sounds/Infinity_Snare.wav')
  },
  {
    keyCode: 67,
    key: 'C',
    id: 'Infinity Hat',
    url: require('./sounds/Infinity_Hat.wav')
  }
];

const soundsGroup = {
heaterKit: firstSoundsGroup
}

const KeyboardKey = ({ play, deactivateAudio, sound }) => {
  const { id, key, url, keyCode } = sound;
  const handleClick = () => play(key, id);
  const handleKeydown = (e) => {
    if(keyCode === e.keyCode) {
      const audio = document.getElementById(key);
      play(key, id);
      deactivateAudio(audio)
    }
  }

useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
}, [])

return (
  <button id={keyCode} className="drum-pad" onClick={handleClick}>
    <audio className="clip" src={url} id={key} />
    {key}
  </button>
);
};

const Keyboard = ({ sounds, play, power, deactivateAudio }) =>  (
<div className="keyboard">
  {power 
    ? sounds.map((sound) => <KeyboardKey key={sound.id} sound={sound} play={play} deactivateAudio={deactivateAudio} />)
    : sounds.map((sound) => <KeyboardKey key={sound.id} sound={{...sound, url: "#" }} play={play} deactivateAudio={deactivateAudio} />)        
  }
</div>
);

const DrumControl = ({ name, volume, handleVolumeChange }) => (
<div className="control">
  <h2 id="volume">Volume: %{Math.round(volume * 100)}</h2>
  <input
    max="1"
    min="0"
    step='0.01'
    type="range"
    value={volume}
    onChange={handleVolumeChange}
    />
  <h2 id="display" >{name}</h2>
  <p>Kit 1: Rock</p>
  <p>Kit 2: 808</p>
  <p>Kit 3: Infinity</p>
</div>
);

const App = () => {
const [power, setPower] = React.useState(true);
const [volume, setVolume] = React.useState(1);
const [soundName, setSoundName] = React.useState("");
const [soundType, setSoundType] = React.useState("heaterKit");
const [sounds, setSounds] = React.useState(soundsGroup[soundType]);

const styleActiveKey = (key) => {
  key.parentNode.style.backgroundColor = "#000000"
  key.parentNode.style.color = "#ffffff"
}


const deactivateAudio = (audio) => {
 setTimeout(() => {
   audio.parentElement.style.backgroundColor = "#ffffff"
   audio.parentElement.style.color = "#000000"
 }, 150)
}

const play = (key, sound) => {
  setSoundName(sound)
  const audio = document.getElementById(key);
  styleActiveKey(audio);
  audio.currentTime = 0;
  audio.play();
  deactivateAudio(audio)
}

const stop = () => {
   setPower(!power)
}


const handleVolumeChange = e => {
  setVolume(e.target.value)
}


const setKeyVolume = () => {
  const audios = sounds.map(sound => document.getElementById(sound.key));
  audios.forEach(audio => {
    if(audio) {
      audio.volume = volume;
    }
  }) 
}

useEffect(() => {
  setKeyVolume();
}, [volume, sounds]);

return (
  <div className="centered-container">
  <h1 id="boujee-text"><u>Drum Machine</u></h1>
    <div id="display"></div>
  <div id="drum-machine">
    {setKeyVolume()}
    <div className="wrapper">
      <Keyboard sounds={sounds} play={play} power={power} deactivateAudio={deactivateAudio} />
      <DrumControl 
        stop={stop}
        power={power}
        volume={volume} 
        name={soundName || [soundType]} 
        handleVolumeChange={handleVolumeChange} 
       />
    </div>
  </div>
  </div>
)
};

export default App;