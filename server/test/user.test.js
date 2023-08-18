// const chai = require('chai');
// const { describe, it } = require('mocha');
// const mongoose = require('mongoose');
// const UserModel = require('../path-to-your-user-model'); // Replace with the actual path

// chai.should();

// describe('User Model', () => {
//   before(async () => {
//     await mongoose.connect('mongodb://localhost:27017/testdb', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   });

//   after(async () => {
//     await mongoose.connection.close();
//   });

//   it('should be able to save a user', async () => {
//     const userData = {
//       username: 'testuser',
//       email: 'test@example.com',
//       password: 'testpassword',
//     };

//     const newUser = new UserModel(userData);
//     const savedUser = await newUser.save();

//     savedUser.should.have.property('_id');
//     savedUser.username.should.equal(userData.username);
//     savedUser.email.should.equal(userData.email);
//     savedUser.password.should.equal(userData.password);
//     savedUser.should.have.property('qrCode');
//     savedUser.should.have.property('verified');
//     savedUser.should.have.property('otp');
//   });

//   it('should fail to save a user with invalid data', async () => {
//     const invalidUserData = {
//       // Missing required fields
//     };

//     try {
//       const newUser = new UserModel(invalidUserData);
//       await newUser.save();
//     } catch (error) {
//       error.should.have.property('name').equal('ValidationError');
//     }
//   });

//   // Add more test cases for other scenarios

// });
