const Group = require("./groupsModel");
const User = require("../users/userServices");

exports.createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const createdBy = req.appUser.id;

        const creator = await User.findByPk(req.appUser.id);

        if (!creator) {
            return res.status(404).json({ error: "Creator not found" });
        }

        const group = await Group.create({
            name,
            description,
            createdBy,
            updatedBy: createdBy
        });

        res.status(200).json({ message: "group created successfully", group });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['username', 'email'],
                },
            ],
        });

        res.status(200).json({ groups });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGroupbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['username', 'email'],

                },
            ],
        })

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.status(200).json(group)

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, updatedBy } = req.body;

        const updater = await User.findByPk(updatedBy);
        if (!updater) {
            return res.status(404).json({ error: 'Updater not found' });
        }

        const group = await Group.findByPk(id);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        await group.update({ name, description, updatedBy });

        res.status(200).json({ message: 'Group updated successfully', group });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {

        const { id } = req.params;

        const group = await Group.findByPk(id);

        if (!group) {
            return res.status(404).json({ error: "Group not Found" });
        }

        await group.destroy();
        res.status(200).json({ message: 'Group deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}