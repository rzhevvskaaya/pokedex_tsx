import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CaughtPokemons from './pages/CaughtPokemons';
import NoPokemonPage from './pages/NoPokemonPage';
import NotFound from './pages/NotFound';
import PokemonDetail from './pages/PokemonDetail';
import Header from './components/Header';

const App: React.FC = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/caught" element={<CaughtPokemons />} />
                <Route path="/pokemon/:id" element={<PokemonDetail />} />
                <Route path="/no-pokemon" element={<NoPokemonPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;
