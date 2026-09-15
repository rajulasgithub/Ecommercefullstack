import mongoose from 'mongoose';
mongoose.connect('mongodb://rajulasrazak688:rajulasmongocloud@ac-fsropmc-shard-00-00.0kzd0lb.mongodb.net:27017,ac-fsropmc-shard-00-01.0kzd0lb.mongodb.net:27017,ac-fsropmc-shard-00-02.0kzd0lb.mongodb.net:27017/ecommerceapp?ssl=true&replicaSet=atlas-443dfd-shard-0&authSource=admin&appName=Cluster0');
mongoose.connection.on('open', async function () {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections.map(c => c.name));
    process.exit(0);
});
