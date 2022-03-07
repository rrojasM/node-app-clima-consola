require('colors');

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


const main = async () => {
    console.clear();

    const busquedas = new Busquedas();
    let opt;


    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudad(termino);

                const id = await listarLugares(lugares);
                /* console.log({ id }); */


                const lugarSel = lugares.find(l => l.id === id);
                /* console.log(lugarSel); */

                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                console.log('\nINFORMACIÓN DE LA CIUDAD'.green);
                console.log(`Ciudad: ${lugarSel.nombre}`.magenta);
                console.log(`Lat: ${lugarSel.lat}`.green);
                console.log(`Lng: ${lugarSel.lng}`.green);
                console.log(`Temperatura: `, clima.temp);
                console.log(`Mínima:`, clima.min);
                console.log(`Máxima:`, clima.max);
                console.log(`Descripción: ${clima.desc}`);
                break;

            case 2:

                break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);


}


main();