const User = require("./userServices");
const bycrypt = require("bcrypt");

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;

        const password_hash = await bycrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password_hash,
            status: 1,
        });

        res.status(201).json({ user: newUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(500).json({ error: "user not found" });
        }
        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, profile_picture, date_of_birth } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(500).json({ error: "User Not Found" });
        }

        await user.update({ username, email, profile_picture, date_of_birth });

        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(500).json({ error: "User Not Found" });
        }
        await user.update({ status: 0 });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}