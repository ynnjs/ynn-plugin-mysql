const mysql = require( 'mysql2' );

const MYSQL = Symbol( 'mysql' );

module.exports = ( app, options = {} ) => {
    const name = options.name || 'mysql';
    const config = options.config || app.config( name, {} );

    Object.defineProperty( app, options.name || 'mysql', {
        get() {
            if( app[ MYSQL ] ) return app[ MYSQL ];
            if( config.pool === true ) {
                const conn = mysql.createPool( config );
                const msg = `[ynn-plugin-mysql] connection pool ${config.user}@${config.host}:${config.port}/${config.database||'[NO SELECTED DATABASE]'}.`;
                app.console.info( msg );
                app.logger.info( msg );
                app[ MYSQL ] = conn;
            } else {
                const conn = mysql.createConnection( config );
                const msg = `[ynn-plugin-mysql] connected ${config.user}@${config.host}:${config.port}/${config.database||'[NO SELECTED DATABASE]'}.`;
                app.console.info( msg );
                app.logger.info( msg );
                app[ MYSQL ] = conn;
            }
            return app[ MYSQL ];
        },

        set( m ) {
            app[ MYSQL ] = m;
        }
    } );
};
