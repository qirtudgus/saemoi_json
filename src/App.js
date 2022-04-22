import './App.css';
import { Route, Routes } from 'react-router-dom';

import Oliveyoung from './component/oliveyoung';
import Home from './component/home';
import Header from './component/header';
import Mustit from './component/mustit';
import About from './component/about';
import NotReady from './component/notReady';
import Aland from './component/aland';
function App() {



  return (
    <>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/drugstore/olive" element={<Oliveyoung/>}/>
      <Route path="/clothes/aland" element={<Aland/>} />
      <Route path="/clothes/mustit" element={<Mustit/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/sorry"  element={<NotReady />}/>
    </Routes>
    </>
  );
}

export default App;
  