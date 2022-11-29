# Music ApiRest

Esta Api es un backend que trata sobre música, la cual consta de usuarios, bandas y álbumes.

Los usuarios serán de dos tipos o roles y tendrán diferentes autorizaciones.

- Usuario tipo user: Tiene la capacidad de ver y crear bandas y álbumes.
- Usuario tipo admin: Tiene la capacidad de ver, borrar y editar bandas y álbumes, así también será el que pueda borrar usuarios.

Cada usuario también tendrá que tener nombre, contraseña y un campo de bandas favoritas.

Las bandas son los grupos de música que tendrá nuestra base de datos que tendrán nombre, estilo, país e imagen.

Los álbumes como es lógico están relacionados con las bandas y tendrán también los campos: título, año y portada (imagen).

Esto es solo una breve explicación del tema que trata nuestra api, ahora veremos como la hemos creado desde cero.

### Primeros pasos y librerías:

Crear una carpeta con el nombre del proyecto, en nuestro caso se llamará: music.

Para eso escribiremos este comando en la consola.

```bash
mkdir music
```

Dentro de esta carpeta crearemos nuestro **package.json.**
Comando:

```bash
npm init -y
```

**package.json** será nuestro gestor de paquetes

Ahora tenemos que instalar express, que es una librería que nos ayudará a crear la Api Rest.

```bash
npm i express
```

La siguiente librería que vamos a instalar se llama **mongoose** y nos permite interactuar y conectarnos a la base de datos (DB).

```bash
npm i mongoose
```

Otra librería que tenemos que instalar es **dontenv**  con la que podremos tener variables de entorno.

```bash
npm i dotenv
```

Para gestionar el proxi hay que instalar una librería llamada **cors**.

```bash
npm i cors
```

Ahora instalaremos **body-parser** que es una librería que nos ayuda a transformar la data.

```bash
npm i body-parser
```

Por último instalaremos **nodemon**  que nos ayuda a transformar la data.

```bash
npm install --save-dev nodemon
```

### 

Ya tenemos instaladas todas las librerías necesarias que nos permitirán empezar el proyecto, más tarde habrá que instalar otras.

Es el momento de configurar nuestro archivo package.json.

Lo importante de configurar son los scripts de ejecución, y tendrían que estar de esta forma:

```bash
{
  "name": "music",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon ./src/index.js",
    "start": "node ./src/index.js",

```

Como nuestro archivo de arranque será index.js, cuando queramos levantar nuestro servidor tendremos que escribir en la consola:

```jsx
npm run dev
```

### Crear y estructurar carpetas y ficheros:

En la raíz de mi proyecto creo la carpeta **src,** dentro de esta crearé las carpetas: **api**, **helpers** y **middlewares**.

![image text](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a8de87f2-11ea-4096-b2f7-98b036b007c3/Untitled.png)

En la raíz igual con con la carpeta src vamos a crear los siguientes ficheros:

**.env**: Este archivo contiene las variables de entorno y se gestiona con la librería **dotenv**.

Dentro de este archivo escribiremos nuestras variables de entorno:

```
PORT=8080
MONGO_URI=mongodb+srv://admin:admin@finalnode.ivwvv76.mongodb.net/music?retryWrites=true&w=majority
```

La URI se genera en mongo de la siguiente manera:

![image text](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c90de22e-a006-4769-babc-a0f1508230e8/mongoAtlas.gif)

.gitignore: Este fichero indica a git lo que debe di ignorar a la hora de subir nuestro repositorio.

Dentro de este archivo debemos tener la siguiente información:

```
/node_modules

/.env
```

 Hasta el momento nuestra estructura quedaría asi:

![image text](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/50364977-4ecb-4fe8-b514-313f1807291c/Untitled_(1).png)

Ahora vamos a entrar en la carpeta **helpers** (dentro de **src**) y vamos a crear otra carpeta llamada **db**, y dentro de esta carpeta crearemos un archivo llamado **connect.js**

Este archivo tendrá este contenido:

```jsx
//Requerimos la librería y la ejecutamos.
const dotenv = require('dotenv').config();
//Rquerimos mongoose para conectarnos a nuestra base de datos.
const mongoose = require('mongoose');
//URI recuperdad del .env
const mongoDB = process.env.MONGO_URI;
//Función asíncrona para conectarnos a la base de datos.
const connect = async () => {
  try {
    const db = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const { name, host } = db.connection;
    console.log(`Conectado a la base de datos : ${name} en el host: ${host}`);
  } catch (error) {
    console.error(setError(550, 'Not connect to DB'));
  }
};
//Exportar la función para recuperarla en el index.js
module.exports = { connect };
```

En la carpeta helpers vamos a crear también la carpeta error con un fichero llamado handle.error.js.

Este archivo contendrá una función que usaremos para setear errores en distintos puntos de nuestro proyecto.

```jsx
const setError = (code, message) => {
  const error = new Error
  error.code = code
  error.message = message
  return error
}

module.exports = { setError }
```

Seguimos con la creación del archivo index.js que será nuestro iniciador del proyecto.

Dentro de la carpeta **src** creamos el archivo **index.js.**

En principio su este sera su código, poco a poco irá incrementándose.

```jsx
//Importamos express para gestionar el servidor
const express = require('express');
//Cors para gestionar el proxi.
const cors = require('cors');
//Método de conexión de la base de datos.
const { connect } = require('./helpers/db/connect');
//Aquí ejecutamos  la conexión.
connect();

//Inicializar express.
const app = express();

//Configuracón de proxies
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

app.use(express.json({ limit: '1mb' }));

app.use(express.urlencoded({ limit: '1mb', extended: true }));

//Capturador de errores
app.use('*', (req, res, next) => next(setError(404, 'Route not found')));

app.use((error, req, res) => {
  return res.status(error.status || 500).json(error.message || 'Unexpected error');
});

//Escuchador del servidor
app.listen(process.env.PORT, () => {
  console.log(`Server running on port: http://localhost:${process.env.PORT}`);
});
```

Una vez tenemos un index.js básico pasamos a crear nuestros modelos.

Nuestros modelos son como ya hemos comentado al principio de la documentación:

Usuario, Bandas y Álbumes.

Lo primero es definir la estructura de datos con la que queremos trabajar, en nuestro será una lista de Películas y otra de Actores. Por lo tanto una Película puede contener ‘n’ de actores.

Dentro de la carpeta src/api vamos a crear tres carpetas correspondientes a los tres modelos que tenemos.

![image text](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3635e6cd-bf2d-46ac-adcb-4decb862efe2/Untitled_(2).png)

En la carpeta **user** vamos a crear el fichero **user.model.js**

En este archivo daremos forma al esquema del usuario y definiremos sus campos.

En este punto deberemos instalar la librería bcrypt que nos va a servir para generar contraseñas únicas a partir de la contraseña del usuario.

```jsx
npm install bcrypt
```

Una vez instalada vamos a definir nuestro modelo usuario.

```jsx
//Requerimos mongoose.
const mongoose = require('mongoose');
//Requerimos bcrypt.
const bcrypt = require('bcrypt');
//Creamos el esquema con este método.
const userSchema = new mongoose.Schema(
  {
//Definimos los campos del usuario y el contenido.
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favouriteBands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'bands' }],
    role: { type: String, required: true, default: 'user' },
    image: { type: String, required: true },
  },
  {
//Fecha de creación - modificación.
    timestamps: true,
  },
);
//Con esta función asignamos una contraseña única a la contraseña del usuario.
userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
//Guardamos la referencia del esquema y la exportamos.
module.exports = mongoose.model('users', userSchema);
```

Vamos a definir el modelo **band.model.js** que tendremos que crear dentro de la carpeta **band**.

```jsx
const mongoose = require('mongoose');

const BandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    style: { type: String, required: true },
    country: { type: String },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('bands', BandSchema);

```

Y por último vamos a definir el modelo **album.model.js** que estará en la carpeta **album**.

```jsx
const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    band: { type: mongoose.Schema.Types.ObjectId, ref: 'bands' },
    year: { type: Number },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('albums', AlbumSchema);
```

Dado que nuestros modelos contienen subida de imágenes y autenticación vamos a generar los middlewares.

Dentro de la carpeta middlewares vamos a crear los siguientes ficheros:

**admin.middleware.js**, **auth.middleware.js**, **file.js** y **delete-file.js**.

Es el momento de instalar otro paquete, la librería **JWT** que nos servirá para generar un token cada vez que se loguee un usuario.

```jsx
npm install jsonwebtoken
```

También vamos a abrir nuestro archivo .**env** y añadiremos lo siguiente:

```jsx
SECRET_KEY_JWT=contraseñaqueelijas
```

**admin.middleware.js:**

Este archivo sirve para generar el token del administrador cuando se loguee.

```jsx
//Recuperamos jsonwebtoken
const jwt = require('jsonwebtoken');
//Recuperamos nuestro seteador de errores
const { setError } = require('../helpers/error/handle.error');
//Creamos una funcion para generar el token al loguear al usuario, en este caso con el role de administrador.
const isAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) return res.json(setError(401, 'Not authorized'));

  const splits = authorization.split(' ');

  if (splits.length != 2 || splits[0] != 'Bearer')
    return res.json(setError(400, 'Not Bearer'));

  const jwtStringify = splits[1];

  try {
    var token = jwt.verify(jwtStringify, req.app.get('secretKey'));
  } catch (error) {
    return next(setError(500, 'Token invalid'));
  }

  const authority = {
    id: token.id,
    name: token.name,
    role: token.role,
  };
  if (token.role === 'admin') {
    req.authority = authority;

    next();
  } else {
    next(setError(401, 'Not authorized'));
  }
};

module.exports = { isAdmin };
```

**auth.middleware.js:**

Este fichero será igual que el de administrador pero para el role de usuario.

```jsx
const jwt = require('jsonwebtoken');

const { setError } = require('../helpers/error/handle.error');

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) return res.json(setError(401, 'Not authorized'));

  const splits = authorization.split(' ');

  if (splits.length != 2 || splits[0] != 'Bearer')
    return res.json(setError(400, 'Not Bearer'));

  const jwtStringify = splits[1];

  try {
    var token = jwt.verify(jwtStringify, req.app.get('secretKey'));
  } catch (error) {
    return next(setError(500, 'Token invalid'));
  }

  const authority = {
    id: token.id,
    name: token.name,
  };

  req.authority = authority;

  next();
};

module.exports = { isAuth };
```

En el archivo file.js crearemos la función que sube las imágenes a cloudinary, de esta forma podremos subir imágenes directamente desde nuestro equipo.

Tenemos que instalar los paquetes:

```bash
npm i multer
npm i multer-storage-cloudinary
npm i cloudinary
```

**file.js:**

```jsx
//Requerimos los paquetes instalados
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
//Configuración de nuestro almacén de imágenes
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'music', //Referencia a la carpeta creada en cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif'], //Archivos soportados
  },
});

const upload = multer({ storage });

module.exports = upload;
```

Importante no olvidar tener cuenta en cloudinary y crear la carpeta music en media library.

![image text](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7646678c-6739-4abc-b046-817eb0cf1b40/Untitled_(3).png)

También es importante recuperar estas contraseñas de página inicial de cloudinary ya que las usaremos en nuestro **.env:**

![image text](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/890427c9-dd08-4edf-a759-3c90e116902b/Untitled_(4).png)

Las añadiremos por este orden en el archivo **.env,** quedando de la siguiente manera:

```jsx
SECRET_KEY_JWT=contraseñaqueelijas
PORT=8080
MONGO_URI=mongodb+srv://admin:admin@finalnode.ivwvv76.mongodb.net/music?retryWrites=true&w=majority
CLOUD_NAME=dghnwllrc
API_KEY=637887398555552
API_SECRET=aOcHx1NSVcFasdfafayEjJjTP-m
```

**delete-file.js:** 

Para borrar imágenes en cloudinary.

```jsx
const cloudinary = require('cloudinary').v2;
//Función que borra la imagen de cloudinary
const deleteFile = (imgUrl) => {
  const imgSplited = imgUrl.split('/');
  const nameSplited = imgSplited[imgSplited.length - 1].split('.');
  const folderSplited = imgSplited[imgSplited.length - 2];
  const public_id = `${folderSplited}/${nameSplited[0]}`;
  cloudinary.uploader.destroy(public_id, () => {
    console.log('Image delete in cloudinary');
  });
};

module.exports = { deleteFile };
```

Una vez tenemos todos los modelos hechos, y nuestros ficheros del middleware deberemos crear los controladores.

Un controlador es un conjunto de funciones que solicitan, envían, eliminan o modifican la info de la DB.

Vamos a empezar creando el fichero **user.controller.js** dentro de la carpeta **user**.

Vamos con el código:

```jsx
//Requerimos bcrypt para la encriptación de contraseñas
const bcrypt = require('bcrypt');
//Requerimos jwt para generar el token
const jwt = require('jsonwebtoken');
//Requerimos el modelo user
const User = require('./user.model');
//Requerimos el seteador de errores
const { setError } = require('../../helpers/error/handle.error');
//Requerimos nuestra función de eliminar imágenes
const { deleteFile } = require('../../middlewares/delete-file');
//Método para registrar un usuario
const register = async (req, res, next) => {
  try {
		
    const newUser = new User(req.body);
    if (req.file) {
      newUser.image = req.file.path;
    }
    const userDuplicate = await User.findOne({ username: newUser.username });

    if (userDuplicate) return next('User already exists');

    const newUserDB = newUser.save();
    return res.json({
      status: 201,
      message: 'user registered',
      data: newUserDB,
    });
  } catch (error) {
    return next(setError(500, 'User registered fail'));
  }
};
//Método para loguear usuario
const login = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({ username: req.body.username });
    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
      userInfo.password = null;
      const token = jwt.sign(
        {
          id: userInfo._id,
          username: userInfo.username,
          role: userInfo.role,
        },
        req.app.get('secretKey'),
        { expiresIn: '1h' },
      );
      /*    const refreshToken = jwt.sign(
        {
          id: userInfo._id,
          username: userInfo.username,
          role: userInfo.role,
        },
        req.app.get('secretKey'),
      ); */
      return res.json({
        status: 200,
        message: 'welcome User',
        user: userInfo,
        token: token,
      });
    } else {
      return next('Incorrect password');
    }
  } catch (error) {
    return next(setError(500, 'User login fail'));
  }
};
//Método para editar usuario
const patchUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patchUserDB = new User(req.body);

    patchUserDB._id = id;
    const userDB = await User.findByIdAndUpdate(id, patchUserDB);

    if (req.file) {
      deleteFile(userDB.image);
      patchUserDB.image = req.file.path;
    }

    if (!userDB) {
      return next('User not found');
    }
    return res.status(200).json({
      new: userDB,
      old: userDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in user update'));
  }
};
//Método para eliminar un usuario
const removeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser.image) {
      deleteFile(deletedUser.image);
    }
    if (!deletedUser) {
      return next(setError(404, 'User not found'));
    }
    return res.status(200).json({
      message: 'User deleted',
      deletedUser,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in User deletion'));
  }
};
//Método para recuperar todos los usuarios
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json({
      status: 200,
      message: 'Recovered all Users',
      data: { users },
    });
  } catch (error) {
    return next(setError(500, 'Fail to recover users'));
  }
};
//Método para recuperar un usuario por id
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, removeUser, patchUser, getUsers, getUser };
```

**band.controller.js**

```jsx
//Requerimos el modelo band
const Band = require('./band.model');

const { setError } = require('../../helpers/error/handle.error');
const { deleteFile } = require('../../middlewares/delete-file');
//Método para recuperar todas las bandas
const getBands = async (req, res, next) => {
  try {
    
    const bands = await Band.find()
    return res.json({
      status: 200,
      message: 'Recovered all Bands',
      data: { bands },
    });
  } catch (error) {
    return next(setError(500, 'Fail to recover bands'));
  }
};
//Método para recuperar una banda por id
const getBand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const band = await Band.findById(id);
    res.status(200).json(band);
  } catch (error) {
    return next(error);
  }
};
//Método para postear una banda
const postBand = async (req, res, next) => {
  try {
    const band = new Band(req.body);
    if (req.file) {
      band.image = req.file.path;
    }
    const bandInDB = await band.save();
    return res.status(201).json({
      message: 'Band created',
      bandInDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in band creation'));
  }
};
//Método para editar una banda
const patchBand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patchBandDB = new Band(req.body);

    patchBandDB._id = id;
    const bandDB = await Band.findByIdAndUpdate(id, patchBandDB);

    if (req.file) {
      deleteFile(bandDB.image);
      patchBandDB.image = req.file.path;
    }

    if (!bandDB) {
      return next('Band not found');
    }
    return res.status(200).json({
      new: patchBandDB,
      old: bandDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in band update'));
  }
};
//Método para eliminar una banda
const removeBand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBand = await Band.findByIdAndDelete(id);
    if (deletedBand.image) {
      deleteFile(deletedBand.image);
    }
    if (!deletedBand) {
      return next(setError(404, 'Band not found'));
    }
    return res.status(200).json({
      message: 'Band deleted',
      deletedBand,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in Band deletion'));
  }
};
//Método para recuperar una banda por nombre
const getByName = async (req, res) => {
  const { name } = req.params;

  try {
    const bandByName = await Band.find({ name: name });
    return res.status(200).json(bandByName);
  } catch (error) {
    return res.status(500).json(error);
  }
};
//Metodo para encontrar una banda por estilo
const getByStyle = async (req, res) => {
  const { style } = req.params;

  try {
    const bandByStyle = await Band.find({ style: style });
    return res.status(200).json(bandByStyle);
  } catch (error) {
    return res.status(500).json(error);
  }
};
//Método para encontrar una banda según su país
const getByCountry = async (req, res) => {
  const { country } = req.params;

  try {
    const bandByCountry = await Band.find({ country: country });
    return res.status(200).json(bandByCountry);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getBands,
  getBand,
  postBand,
  patchBand,
  removeBand,
  getByName,
  getByStyle,
  getByCountry,
};
```

**album.controller.js**

En este controlador haremos lo mismo que en de band pero con algunos matices que indicamos en  el código de abajo.

```jsx
const Album = require('./album.model');

const { setError } = require('../../helpers/error/handle.error');
const { deleteFile } = require('../../middlewares/delete-file');

const getAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find().populate('band');//Como los álbumes están relacionados con las bandas usamos el método populate.
    return res.json({
      status: 200,
      message: 'Recovered all Albums',
      data: { albums },
    });
  } catch (error) {
    return next(setError(500, 'Fail to recover albums'));
  }
};

const getAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id).populate('band');
    res.status(200).json(album);
  } catch (error) {
    return next(error);
  }
};

const postAlbum = async (req, res, next) => {
  try {
    const album = new Album(req.body);
    if (req.file) {
      album.image = req.file.path;
    }
    const albumInDB = await album.save();
    return res.status(201).json({
      message: 'Album created',
      albumInDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in album creation'));
  }
};

const patchAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patchAlbumDB = new Album(req.body);

    patchAlbumDB._id = id;
    const albumDB = await Album.findByIdAndUpdate(id, patchAlbumDB);

    if (req.file) {
      deleteFile(albumDB.image);
      patchAlbumDB.image = req.file.path;
    }

    if (!albumDB) {
      return next('Album not found');
    }
    return res.status(200).json({
      new: albumDB,
      old: albumDB,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in album update'));
  }
};

const removeAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAlbum = await Album.findByIdAndDelete(id);
    if (deletedAlbum.image) {
      deleteFile(deletedAlbum.image);
    }
    if (!deletedAlbum) {
      return next(setError(404, 'Album not found'));
    }
    return res.status(200).json({
      message: 'Album deleted',
      deletedAlbum,
    });
  } catch (error) {
    return next(setError(500, error.message | 'Failed in Album deletion'));
  }
};
//Recuperamos los álbumes por título
const getByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const albumByTitle = await Album.find({ title: title });
    return res.status(200).json(albumByTitle);
  } catch (error) {
    return res.status(500).json(error);
  }
};
//Recuperamos las bandas a partir del año que escribamos en el path
const getByYear = async (req, res) => {
  const { year } = req.params;

  try {
    const albumByYear = await Album.find({ year: { $gt: year } });
    return res.status(200).json(albumByYear);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getAlbums,
  getAlbum,
  postAlbum,
  patchAlbum,
  removeAlbum,
  getByTitle,
  getByYear,
}
```

Después de terminar con los controladores lo que tenemos que hacer son las rutas, para ello en las carpetas donde tenemos los modelos y los controladores crearemos un archivo de rutas.

Empezamos por las rutas rutas del usuario. Dentro de la carpeta user generamos un archivo llamado **user.routes.js**.

Este fichero contendrá todas las rutas de los endpoints generados en el controlador.

**user.routes.js**

```jsx
//Creamos una constante que requiere el enrutador de express.
const UserRoutes = require('express').Router();
//Requerimos la funcion de la subida de imágenes
const upload = require('../../middlewares/file');
//Requerimos la función de las autenticaciones de usuario y administrador
const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');

//Importamos todos los endpoints del controlador
const {
  register,
  login,
  removeUser,
  patchUser,
  getUsers,
  getUser,
} = require('./user.controller');

//Con los métodos POST, DELETE, PATCH Y GET definiremos las rutas según lo que ese endpoint haga.
//Registrar un usuario con el método post y le colocamos la subida de imágenes de cloudinary
UserRoutes.post('/register', upload.single('image'), register);
//Para loguearse usamos el método post también.
UserRoutes.post('/login', login);
//Para borrar un usuario usamos delete y el path id, le pasamos la funcion isAdmin ya que será el administrador el único que pueda realizar esta función.
UserRoutes.delete('/:id', [isAdmin], removeUser);
//Para editar usamos patch con el path id, y le pasamos la subida de imágenes y la función isAuth ya que el usuario podra editar su usuario.
UserRoutes.patch('/:id', upload.single('image'), [isAuth], patchUser);
//Para recuperar usuarios usamos get
UserRoutes.get('/', getUsers);
//Para recuperar un solo usuario
UserRoutes.get('/:id', getUser);
//Exportamos las rutas para usarlas en el index.js
module.exports = UserRoutes;
```

Dentro de la carpeta album creamos el archivo **band.routes.js.**

**band.routes.js**

En este fichero haremos exactamente lo mismo que en las rutas de user, esta vez con las bandas.

```jsx
const BandRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');

const {
  getBands,
  getBand,
  postBand,
  patchBand,
  removeBand,
  getByName,
  getByStyle,
  getByCountry,
} = require('./band.controller');

BandRoutes.get('/', getBands);

BandRoutes.get('/:id', getBand);

BandRoutes.post('/', upload.single('image'), [isAuth], postBand);

BandRoutes.patch('/:id', upload.single('image'), [isAdmin], patchBand);

BandRoutes.delete('/:id', removeBand);

BandRoutes.get('/name/:name', getByName);

BandRoutes.get('/style/:style', getByStyle);

BandRoutes.get('/country/:country', getByCountry);

module.exports = BandRoutes;
```

Dentro de la carpeta album creamos el archivo **album.routes.js.**

Haremos lo igual que con el archivo anterior.

**album.routes.js**

```jsx
const AlbumRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');

const {
  getAlbums,
  getAlbum,
  postAlbum,
  patchAlbum,
  removeAlbum,
  getByTitle,
  getByYear,
} = require('./album.controller');

AlbumRoutes.get('/', getAlbums);

AlbumRoutes.get('/:id', getAlbum);

AlbumRoutes.post('/', upload.single('image'), [isAuth], postAlbum);

AlbumRoutes.patch('/:id', upload.single('image'), [isAdmin], patchAlbum);

AlbumRoutes.delete('/:id', [isAdmin], removeAlbum);

AlbumRoutes.get('/title/:title', getByTitle);

AlbumRoutes.get('/year/:year', getByYear);

module.exports = AlbumRoutes;
```

Ya tenemos todas las rutas, ahora tenemos que editar el **index.js** para que todo esto funcione.

**index.js**

```jsx
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { connect } = require('./helpers/db/connect');
//Requerimos la configuracion de cloudinary
const { setUpCloudinary } = require('./helpers/cloudinary/cloudinary');
//Requerimos las rutas que creamos anteriormente
const BandRoutes = require('./api/band/band.routes');
const UserRoutes = require('./api/user/user.routes');
const AlbumRoutes = require('./api/album/album.routes');
//Pasamos el seteador de errores
const { setError } = require('./helpers/error/handle.error');

connect();
//Activamos la configuración de cloudinary
setUpCloudinary();

const app = express();
//Configuramos las cabeceras de esta forma
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

//Limite de flujo de información
app.use(express.json({ limit: '1mb' }));
//No codifica caracteres reservador que tienene un significado especial en la URI.
app.use(express.urlencoded({ limit: '1mb', extended: true }));
//Seteamos la clave secreta del token
app.set('secretKey', process.env.SECRET_KEY_JWT);

//Cargamos las rutas
app.use('/api/users', UserRoutes);
app.use('/api/bands', BandRoutes);
app.use('/api/albums', AlbumRoutes);
//Seteamos errores
app.use('*', (req, res, next) => next(setError(404, 'Route not found')));

app.use((error, req, res) => {
  return res.status(error.status || 500).json(error.message || 'Unexpected error');
});
// Queremos ocultar con qué está realizada nuestra API
app.disable('x-powered-by');

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: http://localhost:${process.env.PORT}`);
});
```

Ahora vamos a implementar la paginación a la hora de recuperar bandas.

Vamos a servirnos de una librería llamada mongoose-paginate-v2. Instalamos el paquete:

```jsx
npm install mongoose-paginate-v2
```

Seguidamente abrimos nuestro archivo **band.model.js** y escribimos el siguiente código:

```jsx
const mongoose = require('mongoose');
//Requerimos mongoose-paginate-v2
const mongoosePaginate = require('mongoose-paginate-v2');
const BandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    style: { type: String, required: true },
    country: { type: String },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
//Usamos el método plugin en el esquema band
BandSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('bands', BandSchema);
```

Ahora abrimos el archivo **band.controller.js** y donde tenemos creada la función para recuperar las bandas escribimos el siguiente código:

```jsx
const getBands = async (req, res, next) => {
  try {
		//En este caso queremos que nos devuelva 5 resultados por página
    const { page = 1, limit = 5 } = req.query;
    const bands = await Band.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    return res.json({
      status: 200,
      message: 'Recovered all Bands',
      data: { bands },
    });
  } catch (error) {
    return next(setError(500, 'Fail to recover bands'));
  }
};
```

Hecho esto ya tendremos una paginación que nos devolverá 5 bandas por página.

Queremos que nuestra api pese menos, para ello tendremos que comprimirla, podemos hacerlo usando una librería llamada **compression**. Como con las demás librerías vamos a instalarla.

```jsx
npm install compression
```

Una vez instalada la librería abrimos el **index.js** y escribiremos lo siguiente:

```jsx
const express = require('express');
//Para requerir compression
const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
//Ejecutamos el compresor
app.use(compression());
```

Ahora nuestra api pesará menos.

Por último vamos a implementar la api con **Swagger**, que es una herramienta que sirve para documentar apis con una interfaz gráfica.

En nuestra consola vamos a intalar lo siguiente:

```jsx
npm install swagger-jsdoc swagger-ui-express
```

Una vez instaladas estas dependencias vamos a abrir el fichero **index.js.**

Dentro de **index** escribiremos el siguiente código.

```jsx
//Requerimos path que es una propiedad de exprees
const path = require('path');
//Requerimos las dependencias instaladas
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
//Definimos la configuración especificada por el creador en la documentación
const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Musicapi',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080',//Desde aquí partirá swagger
      },
    ],
  },
  apis: [
//Aquí definiremos nuestras rutas y las concatenaremos con http://localhost:8080
    `${path.join(__dirname, './api/band/band.routes.js')}`,
    `${path.join(__dirname, './api/album/album.routes.js')}`,
    `${path.join(__dirname, './api/user/user.routes.js')}`,
  ],
};
//Ejecutamos swagger 
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));
```

Después vamos a los archivos que contienen las rutas, para escribir el código de swagger en cada endpoint que antes establecimos.

**user.routes.js**

```jsx
const UserRoutes = require('express').Router();
const upload = require('../../middlewares/file');
const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');
//El código de swagger se escribe como si fuera un comentario de js, este código de aquí abajo es un esquema modelo que usaremos como referencia en todos los endpoints.
/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         favouriteBands:
 *           type: string
 *         role:
 *           type: string
 *         image:
 *           type: string
 *       required:
 *         - username
 *         - password
 *         - role
 *         - image
 */
//Este sería el esquema modelo del logueo.
/**
 * @swagger
 * components:
 *   schemas:
 *     userlog:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *       required:
 *         - username
 *         - password
 *         - role
 */

const {
  register,
  login,
  removeUser,
  patchUser,
  getUsers,
  getUser,
} = require('./user.controller');
//Código que sirve para registrar un usuario.
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [users]
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 */

UserRoutes.post('/register', upload.single('image'), register);
//Código para loguearse.
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log a new user
 *     tags: [users]
 *     description: Log a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/userlog"
 *     responses:
 *       200:
 *         description: succes
 */
UserRoutes.post('/login', login);
//Código para eliminar un usuario.
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: delete a user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: delete a user
 *     responses:
 *       200:
 *         description: Success
 *
 */
UserRoutes.delete('/:id', [isAdmin], removeUser);
//Código para editar un usuario.
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: edit a user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: edit a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 *     responses:
 *       200:
 *         description: Success
 *
 */
UserRoutes.patch('/:id', upload.single('image'), [isAuth], patchUser);
//Código para recuperar todos los usuarios.
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: return users
 *     tags: [users]
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Success
 *
 */
UserRoutes.get('/', getUsers);
//Código para recuperar un usuario.
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: return a user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: Get a user
 *     responses:
 *       200:
 *         description: Success
 *
 */
UserRoutes.get('/:id', getUser);

module.exports = UserRoutes;
```

Ya tendríamos nuestro swagger para el modelo usuario, haremos lo mismo con los demás modelos.

**band.routes.js**

```jsx
const BandRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');
/**
 * @swagger
 * components:
 *   schemas:
 *     band:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         style:
 *           type: string
 *         country:
 *           type: string
 *         image:
 *           type: string
 */

/**
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const {
  getBands,
  getBand,
  postBand,
  patchBand,
  removeBand,
  getByName,
  getByStyle,
  getByCountry,
} = require('./band.controller');
/**
 * @swagger
 * /api/bands:
 *   get:
 *     summary: Get all bands
 *     tags: [bands]
 *     description: Get all bands
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/', getBands);
/**
 * @swagger
 * /api/bands/{id}:
 *   get:
 *     summary: return a band
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: Get a band
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/:id', getBand);
/**
 * @swagger
 * /api/bands:
 *   post:
 *     summary: Post a new band
 *     tags: [bands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/band"
 */
BandRoutes.post('/', upload.single('image'), [isAuth], postBand);
/**
 * @swagger
 * /api/bands/{id}:
 *   patch:
 *     summary: edit a band
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: edit a band
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/band"
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.patch('/:id', upload.single('image'), [isAdmin], patchBand);
/**
 * @swagger
 * /api/bands/{id}:
 *   delete:
 *     summary: delete a band
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: delete a band
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.delete('/:id', removeBand);
/**
 * @swagger
 * /api/bands/name/{name}:
 *   get:
 *     summary: Get a band by name
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: name
 *     description: Get a band by name
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/name/:name', getByName);
/**
 * @swagger
 * /api/bands/style/{style}:
 *   get:
 *     summary: Get a band by style
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: style
 *     description: Get a band by style
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/style/:style', getByStyle);
/**
 * @swagger
 * /api/bands/country/{country}:
 *   get:
 *     summary: Get a band by country
 *     tags: [bands]
 *     parameters:
 *       - in: path
 *         name: country
 *     description: Get a band by country
 *     responses:
 *       200:
 *         description: Success
 *
 */
BandRoutes.get('/country/:country', getByCountry);

module.exports = BandRoutes;
```

**album.routes.js**

```jsx
const AlbumRoutes = require('express').Router();
const upload = require('../../middlewares/file');

const { isAuth } = require('../../middlewares/auth.middlewares');
const { isAdmin } = require('../../middlewares/admin.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     album:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         band:
 *           type: string
 *         year:
 *           type: number
 *         image:
 *           type: string
 */

const {
  getAlbums,
  getAlbum,
  postAlbum,
  patchAlbum,
  removeAlbum,
  getByTitle,
  getByYear,
} = require('./album.controller');

/**
 * @swagger
 * /api/albums:
 *   get:
 *     summary: Get all albums
 *     tags: [albums]
 *     description: Get all albums
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: objet
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/album"
 */
AlbumRoutes.get('/', getAlbums);
/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     summary: return a album
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: Get a album
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.get('/:id', getAlbum);
/**
 * @swagger
 * /api/albums:
 *   post:
 *     summary: post an album
 *     security:
 *      -bearerAuth: []
 *     tags: [albums]
 *     description: Lets a user post a new album
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/album"
 */

AlbumRoutes.post('/', upload.single('image'), [isAuth], postAlbum);
/**
 * @swagger
 * /api/albums/{id}:
 *   patch:
 *     summary: edit an album
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: edit an album
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/album"
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.patch('/:id', upload.single('image'), [isAdmin], patchAlbum);
/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     summary: delete a album
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         name: id
 *     description: delete a album
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.delete('/:id', [isAdmin], removeAlbum);
/**
 * @swagger
 * /api/albums/title/{title}:
 *   get:
 *     summary: Get a band by title
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         name: title
 *     description: Get a band by title
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.get('/title/:title', getByTitle);
/**
 * @swagger
 * /api/bands/year/{year}:
 *   get:
 *     summary: Get a band by year
 *     tags: [albums]
 *     parameters:
 *       - in: path
 *         number: number
 *     description: Get a band by year
 *     responses:
 *       200:
 *         description: Success
 *
 */
AlbumRoutes.get('/year/:year', getByYear);

module.exports = AlbumRoutes;
```

Finalmente si vamos a [http://localhost:8080/api-doc](http://localhost:8080/api-doc/#/) tendríamos algo así:

![image text](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/61504ea6-1659-4295-acbc-751b9619cdd6/Untitled_(5).png)