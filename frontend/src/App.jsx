import { useState } from 'react'

import './App.css'

function App() {


  return (
    <>
    <div data-theme='retro'>
      <h1 class="text-3xl text-amber-900 font-bold underline">
    Hello world!
  </h1>
  <button className="btn btn-primary">Secondary</button>
    This div will always use light theme
    <span data-theme="retro">This span will always use retro theme!</span>

    </div>

     
     
    </>
  )
}

export default App
