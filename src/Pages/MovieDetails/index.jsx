import { 
   Container,
   Content,
   MovieCover,
   MovieDetail,
   TitleMovie,
   InfoMovie,
   Assessment,
//    ImageAssessment,
   Synopsis,
   TextSynopsis, 
   PeopleMovieContainer,
   PeopleMovieContent,
   TitlePeople,
   InfoPeople,
   ContentMidia,
   CastTitle,
   CastContainer,
   CastCard,
   NameCast,
   NameCharacter,
   TrailerTitle,
   MovieTrailer,
   RecommendationsTitle,
   MovieRecommendationsContainer,
} from "./styles";
import { useEffect, useState } from "react";
import { api } from "../../Services/api";
import { Link, useParams } from "react-router-dom";

import { CardMovie } from "../../Components/CardMovie";
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import { getYear,format } from "date-fns";

import 'react-circular-progressbar/dist/styles.css';
import ReactPlayer from 'react-player/youtube';

import imgNotFound from '../../Assets/notfound.png';
import imgVideoNotFound from '../../Assets/videonotfound.png';

export function MovieDetails(props) {
   const { id }  = useParams();    
   const [movieDetails, setMovieDetails] = useState([]);
   const [movieCurrent, setMovieCurrent] = useState([]);
   const [movieRecommendations, setMovieRecommendations] = useState([]);
   const [realeseDate,setRealeaseDate] = useState({});
   const [castInfo, setCastInfo] = useState([]);
   const [crewInfo, setCrewInfo] = useState([]);
   
   // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect(async () => {
       try {
           await api.get(`movie/${id}?api_key=146396b763924a689540bfc1189f3c63&append_to_response=videos&language=pt-BR`)
           .then(response => setMovieDetails((response.data)))
           
           await api.get(`movie/${id}/release_dates?api_key=146396b763924a689540bfc1189f3c63`)
           .then(response => {
               const data = response.data.results;
               
               for(let obj of data) {
                   if (obj.iso_3166_1 === "BR") {
                       // console.log(obj)
                       setRealeaseDate(obj)
                       break
                   }
               }
           })
           
           await api.get(`movie/${id}/credits?api_key=146396b763924a689540bfc1189f3c63&language=pt-BR`)
           .then(response => setCastInfo(response.data.cast))

           await api.get(`movie/${id}/credits?api_key=146396b763924a689540bfc1189f3c63&language=pt-BR`)
           .then(response => {
               const data = response.data.crew
               let filteredData = [];

               for(let obj of data) {
                   if (["Characters","Director","Writer"].includes(obj.job)) {
                       filteredData.push(obj);
                   }
               }
               setCrewInfo(filteredData);
           })

           await api.get(`movie/${id}/recommendations?api_key=146396b763924a689540bfc1189f3c63&language=en-US&page=1`)
           .then(response => setMovieRecommendations(response.data.results))
       } catch (error) {
           console.log(error)
       }
           
   }, [id, movieCurrent]);
   
   const {title,poster_path,vote_average,release_date,runtime ,genres, videos} = movieDetails;

   const dateFormated = release_date ? format(new Date(release_date), "dd/MM/yyyy") : "";
   const year = release_date ? getYear(new Date(release_date)): "";
   const movieHour = runtime ? Math.floor(runtime/60) : "";
   const movieMin = runtime ? runtime % 60 : "";

   return (
       <Container>
           <Content>
           <MovieCover src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt={title} />
           <MovieDetail>
               <TitleMovie>{title} ({year})</TitleMovie>
               <InfoMovie> 
                   {realeseDate && realeseDate.iso_3166_1 ? realeseDate.release_dates[0].certification : ""} anos 
                   * 
                   {dateFormated} *  (BR)  * 
                   {genres ? genres.map((genre, index) => (` ${genre.name}${index + 1 === genres.length ? " " : ", "}`)): ""}* 
                   {movieHour}h {movieMin}m
               </InfoMovie>
               <Assessment>
                   <div style={{ width: 65, height: 65 }}>
                       <CircularProgressbar 
                           value={vote_average / 100} 
                           maxValue={1} 
                           text={`${vote_average * 10}%`} 
                           styles={buildStyles({
                               pathColor: '#FFF',
                               textColor: '#14FF00',
                               trailColor: '#14FF00',
                               backgroundColor: '#14FF00',
                           })}
                       
                       />   
                   </div>
                   <p>Avaliação dos <br /> usuários</p>
               </Assessment>
           
               <Synopsis>Sinopse</Synopsis>
               <TextSynopsis>{movieDetails ? movieDetails.overview : "Não encontrado"}</TextSynopsis>
           
                   <PeopleMovieContainer>
                       {
                           crewInfo.map(crew => (
                               <PeopleMovieContent key={crew.id}>
                                   <TitlePeople>{crew.name}</TitlePeople>
                                   <InfoPeople>{crew.job}</InfoPeople>
                               </PeopleMovieContent>
                           ))
                       }

                   </PeopleMovieContainer>

           </MovieDetail> 
           </Content>
           <ContentMidia>
           <CastTitle>Elenco original</CastTitle>   
           <CastContainer>
               {
                   castInfo.map(cast => (
                       <CastCard key={cast.id}>
                       <img src={cast.profile_path === null ? imgNotFound : `https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt={cast.name} />
                       <NameCast>{cast.name}</NameCast>
                       <NameCharacter>{cast.character}</NameCharacter>
                       </CastCard>
                   ))
               }
           </CastContainer>
           <TrailerTitle>
               Trailer
           </TrailerTitle>

           <MovieTrailer>
               {videos && videos.results.length ? (
                   <ReactPlayer width='100%' height='100%' url={`https://www.youtube.com/watch?v=${videos ? videos.results[0].key : ""}`} controls={true} />
               ) : (
                   <>
                       <img src={imgVideoNotFound} alt="imgVideoNotFounded"/>
                   </>
               )}
           </MovieTrailer>

           <RecommendationsTitle>Recomendações</RecommendationsTitle>
           <MovieRecommendationsContainer>
              {
                   movieRecommendations.map(movie => (
                   <Link style={{textDecoration:'none'}} onClick={() => setMovieCurrent(movie.id)} key={movie.id} to={`/moviedetails/${movie.id}`}>
                       <CardMovie 
                           title={movie.title} 
                           imagePath={movie.poster_path} 
                           dateRelease={movie.release_date} 
                       >
                       </CardMovie>
                   </Link>
                   ))
              }
           </MovieRecommendationsContainer>
           </ContentMidia>
       </Container>
   )
}