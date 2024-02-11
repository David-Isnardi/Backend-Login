import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define el esquema para el carrito
const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }],
        default: []
    }
});

cartSchema.pre('find', function() {
    this.populate('products.product');
});

mongoose.set('strictQuery', false);
const cartModel = mongoose.model('carts', cartSchema);

// Define el esquema para los mensajes
const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
});

mongoose.set('strictQuery', false);
const messageModel = mongoose.model('messages', messageSchema);

// Define el esquema para los productos
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    status: { type: Boolean, default: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: [String], default: [] },
});

mongoose.set('strictQuery', false);
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model('products', productSchema);

// Define el esquema para los usuarios
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    }
});

const User = mongoose.model('User', userSchema);

export { cartModel, messageModel, productModel, };

export default User;