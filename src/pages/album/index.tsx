import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Pagination from '@material-ui/lab/Pagination';
import { Link } from 'react-router-dom';
import useStyles from './styles';

import api from '../../config/api';

interface Pokemon {
  id: string;
  name: string;
  imgUrl: string;
}

interface PokemonResponse {
  name: string;
  url: string;
}

interface PokeApiResponse {
  count: number;
  next: string;
  previous: string;
  results: PokemonResponse[];
}

const Album: React.FC = (props) => {
  const [pokemons, setPokemons] = useState<Pokemon[] | undefined>();
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const leftZeros = (id: string) => {
    switch (id.length) {
      case 1:
        return `00${id}`;
      case 2:
        return `0${id}`;
      default:
        return id;
    }
  };
  const transformPokemons = (pokemon: PokemonResponse) => {
    const arr = pokemon.url.split('/');
    const pokeID = leftZeros(arr[arr.length - 2]);
    const poke: Pokemon = {
      id: pokeID,
      name: pokemon.name,
      imgUrl: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeID}.png`,
    };
    return poke;
  };

  useEffect(() => {
    const getPokemons = async () => {
      const res = await api.get(
        `https://pokeapi.co/api/v2/pokemon/?offset=${
          page * itemsPerPage
        }&limit=${itemsPerPage}`
      );
      const json: PokeApiResponse = res.data;
      const pokemon = json.results.map((poke) => transformPokemons(poke));

      setPokemons(pokemon);
      setMaxPage(res.data.count / itemsPerPage);
    };

    getPokemons();
  }, [itemsPerPage, page]);

  const toPascalCase = (text: string) => {
    return `${text}`
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/[^\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)(\w+)/, 'g'),
        ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
      )
      .replace(new RegExp(/\s/, 'g'), '')
      .replace(new RegExp(/\w/), (s) => s.toUpperCase());
  };

  const handleChangeItemsperPage = (event: any) => {
    setItemsPerPage(event.target.value);
  };

  const handlePrevPage = () => {
    setPage((prevState) => {
      return prevState - 1;
    });
  };

  const handleNextPage = () => {
    setPage((prevState) => {
      return prevState + 1;
    });
  };

  const itemsPerPageOptions = [
    { value: '10' },
    { value: '50' },
    { value: '100' },
    { value: '200' },
    { value: '1000' },
  ];

  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            <Link className="link" to="/">
              P0kedex
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.cardGrid} maxWidth="md">
        <FormControl className={classes.formControl}>
          <InputLabel id="select-helper-label">Items per page</InputLabel>
          <Select
            labelId="select-helper-label"
            id="select-helper"
            value={itemsPerPage}
            onChange={handleChangeItemsperPage}
          >
            {itemsPerPageOptions.map((item) => (
              <MenuItem value={item.value}>{item.value}</MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            Voltar
          </Button>
          {`ACTUAL PAGE: ${page}`}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNextPage}
            disabled={page === maxPage}
          >
            Avançar
          </Button>
        </FormControl>

        <Grid container spacing={4}>
          {pokemons?.map((pokemon) => (
            <Grid item key={pokemon.id} xs={3} sm={3} md={3}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={pokemon.imgUrl}
                  title={pokemon.name}
                />
                <CardContent className={classes.cardContent}>
                  <Typography
                    align="center"
                    gutterBottom
                    variant="h5"
                    component="h2"
                  >
                    {toPascalCase(pokemon.name)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Album;
