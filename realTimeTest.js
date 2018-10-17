const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', null, null, {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  
    // SQLite only
    storage: './database.sqlite'
  });
  


const Cat = sequelize.define('cat', {
    name: Sequelize.STRING
    , spots: Sequelize.INTEGER
})

sequelize.sync({ force: true })

// install sequelizeStream
const sequelizeStream = require('sequelize-stream')
const stream = sequelizeStream(sequelize)

// when the stream receives data, log
stream.on('data', ({ instance, event }) => console.log(event, instance.toJSON()))

const sleep = async (ms) => {
    console.log(`Sleep ${ms} ms.`)
    return new Promise( resolve => setTimeout(resolve, ms));
}

const createBulk = async () => {
    console.log("---------------------------------------------")
    await sleep(1000)
    const fluffy = await Cat.create({ name: "fluffy" });
    console.log("---------------------------------------------")
    await sleep(2000);
    const spot = await Cat.create({ name: "spot" });
    console.log("---------------------------------------------")
    await sleep(2000)
}

const example = async() => {
    try {
        const sparky = await Cat.create({ name: 'sparky' });
        await sleep(1000)
        // sparky.update({ spots: 2 })
        // await sleep(2000)
        // await Cat.create({ name: "Meaw" })
    } catch (error) {
        console.log(error)
    }
}


createBulk()
.then( () => {
    example()
})