import './App.css';
import { useEffect, useState } from "react";

let x = 90;
let y = 34;
let held_directions = [];
const speed = 5;

const pixelSize = 2;
const camera_left = pixelSize * 66;
const camera_top = pixelSize * 42;

const directions = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
}

const keys = {
  38: directions.up,
  37: directions.left,
  39: directions.right,
  40: directions.down,
}



function App() {
  let leftLimit = -8;
  let rightLimit = (16 * 11)+8;
  let topLimit = -8 + 32;
  let bottomLimit = (16 * 7);

  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [mapTransform, setMapTransform] = useState("translate3d(0)");
  const [characterTransform, setCharacterTransform] = useState("translate3d(0)");
  
  const [facing, setFacing] = useState("down");
  const [walking, setWalking] = useState("true");
  
  const [xNPC, setxNPC] = useState(500);
  const [yNPC, setyNPC] = useState(500);
  const [facingNPC, setFacingNPC] = useState("left");

  const [count, setCount] = useState(1);
  const [isPressed, setPressed] = useState(false);

  useEffect(() => {
    console.log('effect');
    let timeId;
    timeId = setInterval(() => {
      if (facingNPC === directions.left) {
        setxNPC(x => {
          return x - speed;
        })
      } else if (facingNPC === directions.right) {
        setxNPC(x => {
          return x + speed;
        })
      } else if (facingNPC === directions.up) {
        setyNPC(y => {
          return y - speed;
        })
      } else if (facingNPC === directions.down) {
        setyNPC(y => {
          return y + speed;
        })
      }

      if (xNPC <= -8 && facingNPC === directions.left) {
        setFacingNPC(directions.up);
      } else if (xNPC >= 184 && facingNPC === directions.right) {
        setFacingNPC(directions.down);
      }  

      if (yNPC >= 112 && facingNPC === directions.down) {
        setFacingNPC(directions.left);
      } else if (yNPC <= -8 && facingNPC === directions.up) {
        setFacingNPC(directions.right);
      }
      
      setGameHasStarted(x => {
        return !x
      })
    }, 24)

    return () => {
      clearInterval(timeId);
    };
  }, [gameHasStarted]);

  const placeCharacter = () => { 
    let held_direction = held_directions[0];
    if (held_direction) {
       if (held_direction === directions.right) {x += speed;}
       if (held_direction === directions.left) {x -= speed;}
       if (held_direction === directions.down) {y += speed;}
       if (held_direction === directions.up) {y -= speed;}
       setFacing(held_direction);
    }
    setWalking(held_direction ? "true" : "false");
    
    //Limits (gives the illusion of walls)
    
    if (x < leftLimit) { x = leftLimit; }
    if (x > rightLimit) { x = rightLimit; }
    if (y < topLimit) { y = topLimit; }
    if (y > bottomLimit) { y = bottomLimit; }
    console.log(x+'X'+y);
    console.log('leftLimit:' + leftLimit);
    console.log('rightLimit:' + rightLimit);
    console.log('topLimit:' + topLimit);
    console.log('bottomLimit:' + bottomLimit);
    setMapTransform(`translate3d( ${-x*pixelSize+camera_left}px, ${-y*pixelSize+camera_top}px, 0 )`);
    setCharacterTransform(`translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`);  
 }

  const handlePress = param => {
    setGameHasStarted(x => {
      return !x
    })
    setPressed(true);
    held_directions = (isPressed) ? [param] : []
    placeCharacter();
};

  return (
    <div className="frame">
        <div className="corner_topleft"></div>
        <div className="corner_topright"></div>
        <div className="corner_bottomleft"></div>
        <div className="corner_bottomright"></div>
   
        <div className="camera">
            <div style={{transform: `${mapTransform}`}} className="map pixel-art">
              <div style={{transform: `${characterTransform}`}} className="character" facing={facing} walking={walking}>
                  <div className="shadow pixel-art"></div>
                  <div className="character_spritesheet pixel-art"></div>
              </div>
              <div style={{left: `${xNPC}px`, top: `${yNPC}px`}} className="npc" facing={facingNPC} walking="true">
                  <div className="shadow pixel-art"></div>
                  <div className="character_spritesheet pixel-art"></div>
              </div>
              <div className="object">
              </div>
            </div>
            <div className="dpad">
              <div className="DemoDirectionUI flex-center">
                  <button className="dpad-button dpad-left" 
                      onClick={() => handlePress(directions.left)} >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 13 13">
                          <path className="Arrow_outline-top"  stroke="#5f5f5f" d="M1 0h11M0 1h1M12 1h1M0 2h1M12 2h1M0 3h1M12 3h1M0 4h1M12 4h1M0 5h1M12 5h1M0 6h1M12 6h1M0 7h1M12 7h1M0 8h1M12 8h1" />
                          <path className="Arrow_surface" stroke="#f5f5f5" d="M1 1h11M1 2h11M1 3h5M7 3h5M1 4h4M7 4h5M1 5h3M7 5h5M1 6h4M7 6h5M1 7h5M7 7h5M1 8h11" />
                          <path className="Arrow_arrow-inset"  stroke="#434343" d="M6 3h1M5 4h1M4 5h1" />
                          <path className="Arrow_arrow-body" stroke="#5f5f5f" d="M6 4h1M5 5h2M5 6h2M6 7h1" />
                          <path className="Arrow_outline-bottom" stroke="#434343" d="M0 9h1M12 9h1M0 10h1M12 10h1M0 11h1M12 11h1M1 12h11" />
                          <path className="Arrow_edge" stroke="#ffffff" d="M1 9h11" />
                          <path className="Arrow_front" stroke="#cccccc" d="M1 10h11M1 11h11" />
                      </svg>
                  </button>
                  <button className="dpad-button dpad-up" 
                      onClick={() => handlePress(directions.up)} >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 13 13">
                          <path className="Arrow_outline-top"  stroke="#5f5f5f" d="M1 0h11M0 1h1M12 1h1M0 2h1M12 2h1M0 3h1M12 3h1M0 4h1M12 4h1M0 5h1M12 5h1M0 6h1M12 6h1M0 7h1M12 7h1M0 8h1M12 8h1" />
                          <path className="Arrow_surface" stroke="#f5f5f5" d="M1 1h11M1 2h11M1 3h11M1 4h5M7 4h5M1 5h4M8 5h4M1 6h3M9 6h3M1 7h11M1 8h11" />
                          <path className="Arrow_arrow-inset"  stroke="#434343" d="M6 4h1M5 5h1M7 5h1" />
                          <path className="Arrow_arrow-body" stroke="#5f5f5f" d="M6 5h1M4 6h5" />
                          <path className="Arrow_outline-bottom" stroke="#434343" d="M0 9h1M12 9h1M0 10h1M12 10h1M0 11h1M12 11h1M1 12h11" />
                          <path className="Arrow_edge" stroke="#ffffff" d="M1 9h11" />
                          <path className="Arrow_front" stroke="#cccccc" d="M1 10h11M1 11h11" />
                      </svg>
                  </button>
                  <button className="dpad-button dpad-down" 
                      onClick={() => handlePress(directions.down)} >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 13 13">
                          <path className="Arrow_outline-top" stroke="#5f5f5f" d="M1 0h11M0 1h1M12 1h1M0 2h1M12 2h1M0 3h1M12 3h1M0 4h1M12 4h1M0 5h1M12 5h1M0 6h1M12 6h1M0 7h1M12 7h1M0 8h1M12 8h1" />
                          <path className="Arrow_surface" stroke="#f5f5f5" d="M1 1h11M1 2h11M1 3h11M1 4h3M9 4h3M1 5h4M8 5h4M1 6h5M7 6h5M1 7h11M1 8h11" />
                          <path className="Arrow_arrow-inset" stroke="#434343" d="M4 4h5" />
                          <path className="Arrow_arrow-body" stroke="#5f5f5f" d="M5 5h3M6 6h1" />
                          <path className="Arrow_outline-bottom" stroke="#434343" d="M0 9h1M12 9h1M0 10h1M12 10h1M0 11h1M12 11h1M1 12h11" />
                          <path className="Arrow_edge" stroke="#ffffff" d="M1 9h11" />
                          <path className="Arrow_front" stroke="#cccccc" d="M1 10h11M1 11h11" />
                      </svg>
                  </button>
                  <button className="dpad-button dpad-right" 
                      onClick={() => handlePress(directions.right)} >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 13 13">
                          <path className="Arrow_outline-top"  stroke="#5f5f5f" d="M1 0h11M0 1h1M12 1h1M0 2h1M12 2h1M0 3h1M12 3h1M0 4h1M12 4h1M0 5h1M12 5h1M0 6h1M12 6h1M0 7h1M12 7h1M0 8h1M12 8h1" />
                          <path className="Arrow_surface" stroke="#f5f5f5" d="M1 1h11M1 2h11M1 3h5M7 3h5M1 4h5M8 4h4M1 5h5M9 5h3M1 6h5M8 6h4M1 7h5M7 7h5M1 8h11" />
                          <path className="Arrow_arrow-inset"  stroke="#434343" d="M6 3h1M7 4h1M8 5h1" />
                          <path className="Arrow_arrow-body" stroke="#5f5f5f" d="M6 4h1M6 5h2M6 6h2M6 7h1" />
                          <path className="Arrow_outline-bottom" stroke="#434343" d="M0 9h1M12 9h1M0 10h1M12 10h1M0 11h1M12 11h1M1 12h11" />
                          <path className="Arrow_edge" stroke="#ffffff" d="M1 9h11" />
                          <path className="Arrow_front" stroke="#cccccc" d="M1 10h11M1 11h11" />
                      </svg>
                  </button>
              </div>
            </div>
        </div>
    </div>
  );
}

export default App;