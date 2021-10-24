const mongoose = require('mongoose');
const User = require('../models/user')
const dotenv = require('dotenv');
dotenv.config()

describe('User model tests', ()=> {
    beforeAll(async() => {
        //first connect to test db
        mongoose.connect(process.env.TEST_DB_CONNECT, {
            useNewUrlParser: true
        }, () => {
            console.log('connected to test db')
        })
        //ensure that we start with no info in db
        await User.deleteMany({})
    })
    afterAll(async ()=> {
        //close connection after test suite runs
        await mongoose.connection.close()
    })
    it('has a module that is defined', () => {
        expect(User).toBeDefined();
    })
    
    it('can create a new user', async () => {
        const testUser = new User({name: 'test', email: 'test@email.com', password: 'test-pass'})
        await testUser.save();
        const foundUser = await User.findOne({name: 'test'})
        expect(foundUser.name).toEqual(testUser.name)
    })
    it('does not create user without required info', async() => {
        const testUser = new User({name: 'test-again'})
        expect(testUser.save()).rejects.toThrow("User validation failed: password: Path `password` is required., email: Path `email` is required.")
    })
})