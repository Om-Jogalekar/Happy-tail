
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const User = require("./userServices");

exports.login = async (req, res) => {

    let { userName, password } = req.body;

    try {
        let user = await User.findOne({ where: { userName, status: '1' } });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid Username or password' });
        }

        let isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid Username or password' });
        }

        let userToken = {
            id: user.id,
            fullName: user.firstName + ' ' + user.lastName,
        };

        let token = jwt.sign(userToken, process.env.JWT_SECRET, { expiresIn: '1h' });
        let refreshToken = jwt.sign(userToken, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                fullName: user.firstName + ' ' + user.lastName,
                accessToken: token,
                refreshToken: refreshToken
            },
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.refreshToken = async (req, res) => {
    let { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired refresh token' });

        let userToken = {
            id: user.id,
            category: user.category,
            roleName: user.category === '0' ? 'SuperAdmin' : user.category === '1' ? 'Vendor' : 'User',
            email: user.email,
            name: user.firstName,
            referCode: user.refferCode,
        };

        let newAccessToken = jwt.sign(userToken, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ accessToken: newAccessToken });
    });
};
