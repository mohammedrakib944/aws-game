import React from 'react'
import MapView from '../sections/map-view'
import GameContainer from '../sections/game-container'

const Game = () => {
  return (
    <div>
      <div className="relative mt-10">
        <MapView />
        <GameContainer />
      </div>
    </div>
  )
}

export default Game
