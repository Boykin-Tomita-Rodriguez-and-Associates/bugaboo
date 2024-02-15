const {db} = require('./db');
const {User, Project, Bug} = require('./models/index');
const {users, projects, bugs} = require('./seedData');

const seed = async () => {
    try{
         // recreate db
        await db.sync({ force: true });
        await User.bulkCreate(users);
        await Project.bulkCreate(projects);
        await Bug.bulkCreate(bugs);
    
        const user1 =  await User.findByPk(1);
        const user2 =  await User.findByPk(2); 
        const project1 =  await Project.findByPk(1);
        const project2 =  await Project.findByPk(2);
        const project3 = await Project.findByPk(3);
        const bug1 =  await Bug.findByPk(1);
        const bug2 =  await Bug.findByPk(2);
        const bug3 =  await Bug.findByPk(3);
        const bug4 =  await Bug.findByPk(4);

      
        await user1.addProject(project1); 
        await user2.addProject(project2); 
        await user2.addProject(project3);
        await project1.addBug(bug1);
        await project1.addBug(bug2);
        await project2.addBug(bug3);
        await project3.addBug(bug4);
      
        
    }catch(error){
        console.log(error);
    };
};



module.exports = seed