import mongoose from "mongoose";

const conectarBD = async () => {
  try {
    await mongoose.connect('mongodb+srv://davidisnardi38:ffrz6Cl6uOIi8SOK@cluster0.wazftbi.mongodb.net/ecommerce?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
   
    console.log('Conexión a la base de datos establecida correctamente');
    //wait cartModel.create({products: []})
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }


};

export default conectarBD;