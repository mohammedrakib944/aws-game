import React from 'react'
import { NavLink } from 'react-router'
import cover from "../../public/assets/cover.png";

const Home = () => {
  return (
    <div 
        className='h-screen flex justify-center items-center'
    >
      <div 
        className='w-1/2 h-1/2 bg-cyan-100 rounded-3xl p-4 flex flex-col justify-between'
        style={{ backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className='h-3/4 flex justify-center items-center'>
            <div className='border bg-slate-100 border-slate-800 p-10 rounded-tr-3xl rounded-bl-3xl'>
                <h1 className='text-4xl'>
                    Start Game
                </h1>
            </div>
        </div>
        <div className='grid grid-cols-2  gap-5 mb-10'>
            <button className='col-span-2 px-auto py-4 bg-slate-800 text-white font-semibold text-2xl rounded-md'>
                <NavLink to="/game">Start Game</NavLink>
            </button>
            <button className='py-4 bg-slate-800 text-white font-semibold text-2xl rounded-md'>Create</button>
            <button className='py-4 bg-slate-800 text-white font-semibold text-2xl rounded-md'>Join</button>
        </div>
      </div>
    </div>
  )
}

export default Home
