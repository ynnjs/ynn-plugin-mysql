const mysql = require( 'mysql2' );

const MYSQL = Symbol( 'mysql' );

function createConnection( app, config = {} ) {
    if( config.pool === true ) {
        const conn = mysql.createPool( config );
        app.output.info( `[ynn-plugin-mysql] connection pool ${config.user}@${config.host}:${config.port}/${config.database||'[NO DATABASE SELECTED]'}.` );
        return conn;
    }
    const conn = mysql.createConnection( config );
    app.output.info( `[ynn-plugin-mysql] connected ${config.user}@${config.host}:${config.port}/${config.database||'[NO DATABASE SELECTED]'}.` );
    return conn;
}

module.exports = ( app, options = {} ) => {
    const name = options.name || 'mysql';
    const config = options.config || app.config( name, {} );

    app[ name ] = function() {
        return createConnection( app, config );
    }

    Object.defineProperty( app[ name ], 'connection', {
        get() {
            if( !app[ name ][ MYSQL ] ) {
                app[ name ][ MYSQL ] = createConnection( app, config );
            }
            return app[ name ][ MYSQL ];
        },

        set( m ) {
            app[ name ] [ MYSQL ] = m;
        }
    } );
};
