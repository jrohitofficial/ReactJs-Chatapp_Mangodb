// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { describe, it, beforeEach } = require('mocha');
// const sinon = require('sinon');
// const ProfileModel = require('../db/models/profile');
// const ContactModel = require('../db/models/contact');
// const response = require('../helpers/response');
// const app = require('../your-express-app'); // Import your express app

// chai.use(chaiHttp);
// const {expect} = chai;

// describe('Profile Controller', () => {
//   describe('findById', () => {
//     beforeEach(() => {
//       sinon.restore();
//     });

//     it('should find user profile by id', async () => {
//       const fakeProfile = { _id: 'fakeId', userId: 'userId', username: 'testuser' };
//       const fakeContact = { _id: 'contactId', userId: 'currentUserId', friendId: 'userId' };

//       sinon.stub(ProfileModel, 'findOne').resolves(fakeProfile);
//       sinon.stub(ContactModel, 'findOne').resolves(fakeContact);
//       sinon.stub(response, 'response');

//       const req = {
//         params: { userId: 'userId' },
//         user: { _id: 'currentUserId' },
//       };
//       const res = {};

//       // eslint-disable-next-line no-undef
//       await yourController.findById(req, res);

//       sinon.assert.calledOnce(ProfileModel.findOne);
//       sinon.assert.calledOnce(ContactModel.findOne);
//       sinon.assert.calledOnce(response.response);

//       const expectedPayload = { ...fakeProfile, saved: true };
//       sinon.assert.calledWith(response.response, {
//         res,
//         payload: expectedPayload,
//       });
//     });

//     it('should handle errors', async () => {
//       const errorMessage = 'An error occurred';
//       sinon.stub(ProfileModel, 'findOne').throws(new Error(errorMessage));
//       sinon.stub(response, 'response');

//       const req = {
//         params: { userId: 'userId' },
//         user: { _id: 'currentUserId' },
//       };
//       const res = {};

//       // eslint-disable-next-line no-undef
//       await yourController.findById(req, res);

//       sinon.assert.calledOnce(ProfileModel.findOne);
//       sinon.assert.calledOnce(response.response);

//       sinon.assert.calledWith(response.response, {
//         res,
//         statusCode: 500,
//         success: false,
//         message: errorMessage,
//       });
//     });
//   });

//   describe('edit', () => {
//     beforeEach(() => {
//       sinon.restore();
//     });

//     it('should edit user profile', async () => {
//       const fakeProfileUpdateResult = { nModified: 1 };
//       sinon.stub(ProfileModel, 'updateOne').resolves(fakeProfileUpdateResult);
//       sinon.stub(response, 'response');

//       const req = {
//         user: { _id: 'currentUserId' },
//         body: { username: 'newusername' },
//       };
//       const res = {};

//       // eslint-disable-next-line no-undef
//       await yourController.edit(req, res);

//       sinon.assert.calledOnce(ProfileModel.updateOne);
//       sinon.assert.calledOnce(response.response);

//       sinon.assert.calledWith(response.response, {
//         res,
//         message: 'Profile updated successfully',
//         payload: fakeProfileUpdateResult,
//       });
//     });

//     it('should handle duplicate username error', async () => {
//       const fakeError = new Error();
//       fakeError.name = 'MongoServerError';
//       fakeError.code = 11000;
//       sinon.stub(ProfileModel, 'updateOne').throws(fakeError);
//       sinon.stub(response, 'response');

//       const req = {
//         user: { _id: 'currentUserId' },
//         body: { username: 'newusername' },
//       };
//       const res = {};

//       // eslint-disable-next-line no-undef
//       await yourController.edit(req, res);

//       sinon.assert.calledOnce(ProfileModel.updateOne);
//       sinon.assert.calledOnce(response.response);

//       sinon.assert.calledWith(response.response, {
//         res,
//         statusCode: 500,
//         success: false,
//         message: 'This username is already taken',
//       });
//     });

//     it('should handle other errors', async () => {
//       const errorMessage = 'An error occurred';
//       sinon.stub(ProfileModel, 'updateOne').throws(new Error(errorMessage));
//       sinon.stub(response, 'response');

//       const req = {
//         user: { _id: 'currentUserId' },
//         body: { username: 'newusername' },
//       };
//       const res = {};

//       // eslint-disable-next-line no-undef
//       await yourController.edit(req, res);

//       sinon.assert.calledOnce(ProfileModel.updateOne);
//       sinon.assert.calledOnce(response.response);

//       sinon.assert.calledWith(response.response, {
//         res,
//         statusCode: 500,
//         success: false,
//         message: errorMessage,
//       });
//     });
//   });
// });
