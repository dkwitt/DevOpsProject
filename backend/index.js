const keys = require("./keys");

const express = require("express");
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.json());

const redis = require("redis");
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS results(number VARCHAR)').catch(err => console.log(err));

function findDominant(arr) {
    var numbs = [];
    var indxs = [];

    //dla kolejnych elementow w tablicy
    for (var i = 0, len = arr.length; i < len; ++i) {
        var found = false;
        //szukaj biezacego elementow w tablicy znalezionych wartosci
        for (var j = 0, nlen = numbs.length; j < nlen; ++j) {
            //jezeli znaleziono biezacy element w tablicy znalezionych wartosci,
            //to zwieksz jego licznik wystapien, zaznacz ze zostal znaleziony i przerwij przeszukiwanie
            if (arr[i] === numbs[j]) {
                indxs[j]++;
                found = true;
                break;
            }
        }
        //jezeli biezacy element nie zostal znaleziony w tablicy znalezionych wartosci
        //to dodaj go do tej tablicy i ustaw licznik jego wystapien na 1
        if (!found) {
            numbs.push(arr[i]);
            indxs[numbs.length - 1] = 1;
        }
    }

    var max = Math.max.apply(Math, indxs); //wyszukaj maksmymalny licznik wystapien
    return numbs[indxs.findIndex(x => x === max)]; //zwroc wartosc dla indeksu z maksymalnym licznikiem wystapien
}

app.get("/:list_of_numbers", (req, resp) => {
    const key = `${req.params.list_of_numbers}`;
    const array_of_numbers = req.params.list_of_numbers.split(',');
    redisClient.get(key, (err, wynik) => {
        if (!wynik) {
            wynik = findDominant(array_of_numbers);
            redisClient.set(key, wynik);
        }
        pgClient.query('INSERT INTO results(number) VALUES (\''+wynik+'\')').catch(err => console.log(err));
        resp.send({ result: wynik })
    });

});



app.get("/", (req, resp) => {
    resp.send('Peekaboo');
});
app.get("/results/", (req, resp) => {
    pgClient.query("SELECT * FROM results", (err, res) => {
        if (err) {
            console.log(err.stack, res);
            resp.send('Error occured when reading from db');
        } else {
            resp.send(res.rows);
        }
    });
});


app.listen(4000, err => {
    console.log("Server listening on port 4000");
});
