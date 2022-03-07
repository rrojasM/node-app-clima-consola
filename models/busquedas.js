const fs = require('fs')
const axios = require('axios');
require('dotenv').config();


class Busquedas {

    historial = [];

    dbPath = './db/database.json';

    constructor() {
        // TODO: leer bd si existe

        this.leerdb()
    }

    get historialCapitalizado() {
        //capitalizar 
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));


            return palabras.join(' ')
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsAppWeather() {

        return {

            'appid': process.env.OPEN_WEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }

    }


    async ciudad(lugar = '') {
        //petición http
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox

            });

            const resp = await instance.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }))

        } catch (error) {
            console.log(error);
            return [];
        }


    }

    async climaLugar(lat, lon) {

        try {
            const instanceClima = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                /* params: {
                    lat,
                    lon,
                    'appid': process.env.OPEN_WEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es'
                } */

                params: { ...this.paramsAppWeather, lat, lon }
            });

            const resp = await instanceClima.get();

            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };


            /* return {
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp
            }; */

        } catch (error) {
            console.log(error)

        }
    }


    agregarHistorial(lugar = '') {

        //Prevenir duplicados

        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }


        /* this.historial = this.historial.splice(0,5); */

        this.historial.unshift(lugar.toLocaleLowerCase());


        this.guardardb();

    }

    guardardb() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerdb() {
        if (!fs.existsSync(this.dbPath)) {
            return null;
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        /* console.log(data); */
        this.historial = data.historial;


    }

}


module.exports = Busquedas;