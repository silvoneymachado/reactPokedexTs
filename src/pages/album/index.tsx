import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  AppBar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  CssBaseline,
  Grid,
  Modal,
  Toolbar,
  Typography,
  Container,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';

import { Pagination } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import useStyles, { getModalStyle } from './styles';
import { toPascalCase } from '../../utils/common';
import { itemsPerPageOptions } from './config';

import api from '../../config/api';

interface Pokemon {
  id: string;
  name: string;
  url: string;
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
interface CardEventNew {
  attibutes: string[];
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  types: {
    type: {
      name: string;
    };
  }[];
}
interface PokemonDetail {
  id: number;
  name: string;
  types: string;
}

const Album: React.FC = (props) => {
  // HardCodded to limit images with error
  const maxItems = 890;
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [pokemons, setPokemons] = useState<Pokemon[] | undefined>();
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [pokemonDetail, setpokemonDetail] = useState<PokemonDetail>();

  const getUrlRequest = () => {
    return `https://pokeapi.co/api/v2/pokemon/?offset=${
      (page - 1) * itemsPerPage
    }&limit=${itemsPerPage}`;
  };

  const getPokemonId = (pokemon: PokemonResponse): string => {
    const arr = pokemon.url.split('/');
    return arr[arr.length - 2];
  };

  const transformPokemons = (pokemon: PokemonResponse) => {
    const pokeID = getPokemonId(pokemon);
    const poke: Pokemon = {
      id: pokeID,
      name: pokemon.name,
      url: pokemon.url,
      imgUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeID}.png`,
    };
    return poke;
  };

  const getValidPokemons = (pokemones: PokemonResponse[]) => {
    return pokemones.filter((poke) => Number(getPokemonId(poke)) <= 10090);
  };

  const getPokemons = async () => {
    const urlRequest = getUrlRequest();
    const res = await api.get(urlRequest === null ? '' : urlRequest);
    const json: PokeApiResponse = res.data;
    const validPokemons = getValidPokemons(json.results);
    const pokemon = validPokemons.map((poke) => transformPokemons(poke));

    setPokemons(pokemon);
    setMaxPage(maxItems / itemsPerPage);
  };

  const mapPokeDetail = (p: PokemonDetailResponse) => {
    const poke: PokemonDetail = {
      id: p.id,
      name: toPascalCase(p.name),
      types: p.types.map((t) => t.type.name).join(', '),
    };

    return poke;
  };

  const getPokmonInfo = async (url: string) => {
    const res = await api.get(url);
    setpokemonDetail(mapPokeDetail(res.data));
  };

  useEffect(() => {
    getPokemons();
  }, [page]);

  const handleChangeItemsperPage = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    const { value } = event.target;
    setItemsPerPage(Number(value));
  };

  const handlePagechange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const showModal = (pokemon: Pokemon) => {
    getPokmonInfo(pokemon.url);
    setModalOpen(true);
  };

  const onModalClose = () => {
    setModalOpen(false);
  };

  const datail = (
    <div style={modalStyle} className={classes.paper}>
      <Card className={classes.card}>
        <CardHeader
          title={`${pokemonDetail?.id} - ${pokemonDetail?.name}`}
          subheader={pokemonDetail?.types}
        />
        <CardMedia
          className={classes.cardMedia}
          style={{ width: 230 }}
          image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetail?.id}.png`}
          title={pokemonDetail?.name}
        />
      </Card>
    </div>
  );

  const renderModal = () => {
    return (
      <Modal open={modalOpen} onClose={onModalClose}>
        {datail}
      </Modal>
    );
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            <Link className="link" to="/">
              P0kedex
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.cardGrid} maxWidth="md">
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel id="select-helper-label">Items per page</InputLabel>
          <Select
            labelId="select-helper-label"
            id="select-helper"
            value={itemsPerPage}
            onChange={handleChangeItemsperPage}
            autoWidth
            fullWidth
            className={classes.selectEmpty}
          >
            {itemsPerPageOptions.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.value}
              </MenuItem>
            ))}
          </Select>
          <Pagination
            defaultPage={1}
            count={maxPage}
            onChange={handlePagechange}
            size="large"
            variant="outlined"
          />
        </FormControl>

        <Grid container spacing={4}>
          {pokemons?.map((pokemon) => (
            <Grid item key={pokemon.id} xs={6} sm={4} md={3}>
              <CardActionArea onClick={() => showModal(pokemon)}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={pokemon.imgUrl}
                    title={pokemon.name}
                    about={pokemon.url}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography
                      align="center"
                      gutterBottom
                      variant="h5"
                      component="h3"
                    >
                      {`#${pokemon.id} ${toPascalCase(pokemon.name)}`}
                    </Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
        {renderModal()}
      </Container>
    </>
  );
};

export default Album;
