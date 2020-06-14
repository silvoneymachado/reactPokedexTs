import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import GlobalStyle from './styles';
import pokedex from '../../assets/img/pokedex.png';

const Home: React.FC = (props) => {
  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        <img src={pokedex} className="App-logo" alt="logo" />
        <p>Welcome!</p>
        <Button variant="contained" color="primary">
          <Link className="link" to="/album">
            Pokémons
          </Link>
        </Button>
      </header>
    </div>
  );
};

export default Home;
