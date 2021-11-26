const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new  Bands();

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Bon Jovi'));
bands.addBand( new Band('Scorpions'));
bands.addBand( new Band('WhiteSnake'));

console.log(bands);


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);
        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    });

    client.on('emitir-mensaje',(payload)=>{
        //io.emit('nuevo-mensaje', 'Hey!!!!');
        client.broadcast.emit('nuevo-mensaje', payload);
    });

    client.on('vote-band',(payload) =>{
        console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

    client.on('add-band',(payload) =>{
        console.log(payload);
        const newBand= new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands',bands.getBands());
    });

    client.on('delete-band',(payload) =>{
        console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

    // client.on('mensaje-Flutter',(payload)=>{
    //     //io.emit('nuevo-mensaje', 'Hey!!!!');
    //     console.log('Mensaje', payload);
    //     client.broadcast.emit('mensaje-Flutter', payload);
    // });



});
