
const axios = require('axios');


class Busquedas {

    historial = ["Madrid", "Mexico","paris"];



    constructor(){
        // TODO: leer bd si existe
    }


    async ciudad(lugar = '') {
        //petición http


        const resp = await axios.get('https://reqres.in/api/users?page=2');
        console.log(resp.data.per_page);

        return[]; //retorna los lugares que coincida 
    }

}


module.exports = Busquedas;