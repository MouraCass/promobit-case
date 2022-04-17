import { useContext } from "react"
import { MoviesContext } from "../../Hooks/MoviesContext"
import { IoCloseCircleSharp } from 'react-icons/io5'
import { Container, Content, GenreButton} from "./styles"


export function GenresFilter(){
   const {genres,filters,handleFilterGenres } = useContext(MoviesContext);

   return (
       <Container>
           <Content>
         <h1>Milhões de filmes, séries e pessoas para descobrir. Explore já.</h1>

            <p>Categorias:</p>
            {genres.map(genre => (
               <GenreButton 
                  key={genre.id} 
                  type="button" 
                  marked={filters.includes(genre.id)}
                  onClick={() => handleFilterGenres(genre.id)}
               >
                  {genre.name}
                  {
                        filters.includes(genre.id) ?
                        (
                           <IoCloseCircleSharp color="#FFF" />
                        ) : (
                           <></>
                        )
                  }
               </GenreButton>
            ))}
         </Content>
      </Container>
   )
}