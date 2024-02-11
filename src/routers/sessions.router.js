import { Router } from "express";
import bcrypt from "bcryptjs"; // Librería para encriptar contraseñas
import User from '../dao/GeneralModels/GeneralModels.js';
import { hasAdminCredentials } from "../public/js/authMiddleware.js";

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }

        // Verificar si las credenciales son de administrador
        const isAdminCredentials = hasAdminCredentials(email, password);

        // Encriptar la contraseña utilizando bcryptjs
        const saltRounds = 10; // Número de rondas de encriptación (mayor número, más seguro pero más lento)
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        // Crear un nuevo usuario con la contraseña encriptada y el rol correspondiente
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword, // Guardamos la contraseña encriptada
            role: isAdminCredentials ? 'admin' : 'usuario'
        });
        await newUser.save();

        const user = {
            _id: newUser._id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            age: newUser.age,
            role: newUser.role
        }

        // Almacenar toda la información del usuario en la sesión
        req.session.user = user;

        return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe en la base de datos
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Verificar la contraseña utilizando bcryptjs
        const passwordsMatch = bcrypt.compareSync(password, user.password);
        if (!passwordsMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const userSession = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
        }

        // Almacenar toda la información del usuario en la sesión
        req.session.user = userSession;

        return res.status(200).json({ message: 'Inicio de sesión exitoso.' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
});

export default router;