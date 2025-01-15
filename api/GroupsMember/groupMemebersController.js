const Groupmember = require('./groupMembersModel');
const User = require("../users/userServices");
const Group = require("../Groups/groupsModel");

exports.addGroupMember = async (req,res)=>{
    try {
        const {userId , groupId , role} = req.body
        
        const newGroupMember = Groupmember.create({
            groupId,userId,role
        });

        res.status(200).json(newGroupMember);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllGroupMembers = async (req,res)=>{
   try {
    const groupMembers = await Groupmember.findAll({
        include:[
            {
                model:User,
                as:'User',
                attributes:['id' , 'username' , 'email'],
            },
            {
                model:Group,
                as:'Group',
                attributes:['id','name','description'],
            }
        ]
    })

    res.status(200).json(groupMembers);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
};

exports.getGroupMemberById = async (req,res)=>{
    try {
        const {id} = req.params;

        const groupMember = await Groupmember.findByPk(id , {
            include:[
                {
                    model:User,
                    as:'User',
                    attributes:['id','username','email'],
                },
                {
                    model:Group,
                    as:'Group',
                    attributes:['id','name','description']
                }
            ]
        });

        if(!groupMember){
            return res.status(404).json({error:"Group member not found"});
        }

        res.status(200).json(groupMember);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGroupMember = async(req,res)=>{
    try {
        const {id} = req.params;
        const {role} = req.body;

        const groupMember = await Groupmember.findByPk(id);
        if (!groupMember) {
            return res.status(404).json({ error: 'Group member not found' });
        }

        await groupMember.update({role});

        res.status(200).json(groupMember);
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}

exports.deleteGroupMemeber = async (req,res)=>{
    try {
        const {id} = req.params;

        const groupMemeber = await Groupmember.findByPk(id);
        if (!groupMemeber) {
            return res.status(404).json({ error: 'Group member not found' });
        }

        await groupMemeber.destroy();
        res.status(200).json({ message: 'Group member deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message }); 
        
    }
}