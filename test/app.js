#!/usr/bin/env node

const Ynn = require( 'ynn' );
const app = new Ynn( {
    root : __dirname,
    debugging : true,
    logging : false,
    plugins : {
        db : {
            path : '../src',
            options : {
                config : {
                    host : '127.0.0.1',
                    port : 3306,
                    user : 'root',
                    password : 'YlaXfcy',
                    database : 'test',
                    pool : true
                }
            }
        }
    },
    routers() {
        const router = this.router;

        router.get( '/', async ( ctx, next, rt ) => {
            const db = rt.app.db;
            const [ rows ] = await db.promise().query( 'SELECT * FROM `user`' );
            rt.response( { rows } );
        } );
    }
} );

module.parent || app.listen( Ynn.cargs.port );
module.exports = app;
