import { createContext, useEffect, useState } from "react"
import { api } from '../Services/api';

export const MoviesContext = createContext([]);

export function MoviesProvider(props) {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [filters, setFilters] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);

    const [page, setPage] = useState(1);

    useEffect(() => {
        try {
            api.get(`movie/popular?api_key=146396b763924a689540bfc1189f3c63&language=pt-BR&page=${page}`)
            .then(response => setMovies(response.data.results))
        
            api.get('genre/movie/list?api_key=146396b763924a689540bfc1189f3c63&language=pt-BR')
            .then(response => setGenres(response.data.genres)); 
            // console.log(movies);
        } catch (error) {
            console.log(error);
        }
        
    }, [page]);

    useEffect(() => {
        try {
            let filteredMovies = [];

            movies.forEach(movie => {
                for(let filter of filters) {
                    if (movie.genre_ids.includes(filter)) {
                        filteredMovies = [...filteredMovies , movie];
                        break
                    }
                }
            })
            setFilteredMovies(filteredMovies);
            // console.log(filteredMovies);
        } catch (error) {
            console.log(error);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    function handleFilterGenres(genre) {
       if (filters.includes(genre)){
            const index = filters.indexOf(genre);

            if (index === 0) {
                setFilters([...filters.slice(index + 1)]);
            } else {
                setFilters([...filters.slice(0, index), ...filters.slice(index + 1)])
            }
        } else {
            setFilters([...filters, genre])
        }    
        // console.log(filters);
    }

    return (
        <MoviesContext.Provider
            value={{
                genres,
                movies,
                filters,
                filteredMovies,
                setPage,
                handleFilterGenres
            }}
        >
            {props.children}
        </MoviesContext.Provider>
    );
}