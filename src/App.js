import { MoviesProvider } from "./Hooks/MoviesContext";
import { Routes, Route, Link } from "react-router-dom";

import { GlobalStyle } from "./Styles/GlobalStyle";

import { Header } from "./Components/Header";
import { MovieList } from "./Pages/MovieList";
import { MovieDetails } from "./Pages/MovieDetails";

export function App(){
  return (
    <MoviesProvider>
      <Header />
        <Routes>
          <Route path='/' element={<MovieList />} />
          <Route path='/moviedetails/:id' element={<MovieDetails />}/>
        </Routes>
      <GlobalStyle />
    </MoviesProvider>
  );
}


