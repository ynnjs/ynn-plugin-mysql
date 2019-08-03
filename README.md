# ynn-plugin-mysql

Ynn的MySQL连接管理插件

## Installation

```sh
$ npm install --save https://github.com/ynnjs/ynn-plugin-mysql.git 
```

## Usage

```js
const Ynn = require( 'ynn' );
const app = new Ynn( {
    root : __dirname,
    debugging : Ynn.DEBUGGING_DANGER,
    logging : false,
    plugins : {
        // app.db
        db : {
            path : 'ynn-plugin-mysql',
            options : {
                config : {
                    host : 'localhost',
                    user : 'root',
                    port : 3306,
                    password : '',
                    supportBigNumbers : true,
                    bigNumberStrings : true
                }
            }
        },
        // 创建另外一个mysql链接，使用 app.anotherDB 获取
        anotherDB : {
            path : 'ynn-plugin-mysql',
            options : {
                // ...
            }
        }
    }
} );
```

### 注意事项

`plugin-mysql` 插件在每次请求中被调用时创建MySQL链接，请求结束后关闭对应链接。如果需要创建一个逻辑独立的链接，可使用 `app.db.connection.promise()`。 __详细配置项请参考[mysql2](https://github.com/sidorares/node-mysql2#readme)文档__
