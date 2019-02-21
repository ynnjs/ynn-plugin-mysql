const mysql = require( 'mysql2' );
const MYSQL = Symbol( 'mysql' );

const PLUGIN_MYSQL_CTX_CONNECTION = Symbol( 'plugin#mysql#ctx#connection' );

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

    function connect() {
        return createConnection( app, config );
    }

    app[ name ] = connect;

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

    app.preuse( ( ctx, next ) => {
        ctx[ name ] = function() {
            if( !ctx[ PLUGIN_MYSQL_CTX_CONNECTION ] ) {
                ctx[ PLUGIN_MYSQL_CTX_CONNECTION ] = connect();
            }
            return ctx[ PLUGIN_MYSQL_CTX_CONNECTION ];
        }

        const { res } = ctx;

        function close() {
            if( ctx[ PLUGIN_MYSQL_CTX_CONNECTION ] ) {
                ctx[ PLUGIN_MYSQL_CTX_CONNECTION ].destroy();
            }
            res.removeListener( 'close', close );
            res.removeListener( 'finish', close );
        }

        res.once( 'close', close );
        res.once( 'finish', close );

        return next();
    } );
};
