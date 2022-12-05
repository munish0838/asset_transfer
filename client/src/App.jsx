import './App.css';
import { Link, Routes, Route } from "react-router-dom";
import './stylesheets/App.css';
import Home  from './Home.js';
import Transfer from './Transfer';
import Navbar from './Navbar';
import Mint from './Mint';
function App() {
  return (

    <div className='App'>
      <Routes>
        
      <Route exact path='/' element = {<Home/>} />
      <Route exact path='/Transfer' element = {<Transfer/>} />
      <Route exact path =  "/Mint" element= {<Mint/>}  />
      </Routes>
      
    </div>

  );
}

export default App;
