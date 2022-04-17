import logoTdmdb from '../../Assets/logo.svg';
import { Container } from './styles';

export function Header() {
    return (
      <Container>  
        <header>
            <img src={logoTdmdb} alt="Tmdb logo" />
        </header>
      </Container>  
    )
}