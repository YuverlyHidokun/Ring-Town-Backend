import mongoose from 'mongoose';

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    //await mongoose.connect(process.env.MONGO_URI_2);

    console.log('✅ Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1); // Sale del proceso si no se conecta
  }
};

export default connection;
