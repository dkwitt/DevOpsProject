import React, { useState} from 'react';
import logo from './logo.svg';
import {  TextField, Button } from '@material-ui/core'
import { makeStyles, ThemeProvider  } from '@material-ui/core/styles';
import './App.css';
import axios from "axios";
import theme from './theme'
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },

}));

function App() {
  const [list_of_numbers, setList_of_numbers] = useState('');
  const [wynik, setWynik] = useState('');
  const [error, setError] = useState('');
  const handleClick = async (event) => {
    event.preventDefault();
    axios.get(`/api/${list_of_numbers}/`).then(res => {
      console.log(list_of_numbers);
      if (res.data.error) {
        setWynik('');
        setError(res.data.error);
      } else {
        setError('');
        setWynik(res.data.result);
      }
    })
  };



  const classes = useStyles();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Wyznaczanie dominanty
        </p>
        <p>
          Podaj cyfry po przecinku
        </p>
        <form onSubmit={handleClick}>
        <ThemeProvider theme={theme}>
        <form className={classes.root} noValidate autoComplete="off">
        <TextField id="txtf-list_of_numbers" label="Cyfry" value={list_of_numbers} required variant="filled" color="secondary" onInput={e => setList_of_numbers(e.target.value)}/>
        </form>
        <form className={classes.root} theme={theme}>
                <Button variant="contained" color="primary" type="submit">
          Oblicz
        </Button>
        </form>
        <form>
        {error ? <h4>{error}</h4> : <h4>{wynik ?  `Dominanta to ${wynik}.`  : ' '}</h4>}
        
        </form>
        
        </ThemeProvider>
        </form>
      </header>
    </div>
  );
}

export default App;
