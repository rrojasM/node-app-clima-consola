const axios = require('axios');
require('dotenv').config();


class Busquedas {

    historial = ["Madrid", "Mexico", "paris"];



    constructor() {
        // TODO: leer bd si existe
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
                params: {
                    lat,
                    lon,
                    'appid': process.env.OPEN_WEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es'
                }
            });

            const resp = await instanceClima.get();
          

            return {
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp
            };

        } catch (error) {
            console.log(error)

        }
    }

}


module.exports = Busquedas;