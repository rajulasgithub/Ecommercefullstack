import request from 'supertest';
import app from '../server.js';
import userDB from '../src/model/user.js';
import loginDB from '../src/model/login.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import sendEmail from '../src/utils/sendEmail.js';

jest.mock('../src/utils/sendEmail.js', () => jest.fn().mockResolvedValue(true));

describe('Auth API', () => {
  const validUser = {
    email: 'testuser@example.com',
    password: 'ValidPass123!',
    firstName: 'Test',
    lastName: 'User',
    number: '1234567890',
    gender: 'Male', // Must exactly match the GENDERS enum if controller checked it (express validator checks it)
    state: 'State',
    district: 'District',
    place: 'Place',
    pincode: '123456'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return validation error if signup is called with missing fields', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({});
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should successfully sign up a new user', async () => {
    jest.spyOn(loginDB, 'findOne').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
    
    // Mock saving the login model
    const mockLoginSave = { _id: 'loginId123', email: validUser.email };
    jest.spyOn(loginDB.prototype, 'save').mockResolvedValue(mockLoginSave);
    
    // Mock saving the user model
    jest.spyOn(userDB.prototype, 'save').mockResolvedValue(true);

    const res = await request(app)
      .post('/auth/signup')
      .send(validUser);
      
    expect(res.statusCode).toEqual(200); // Controller uses 200 for success
    expect(res.body).toHaveProperty('success', true);
  });

  it('should not allow signup with an existing email', async () => {
    jest.spyOn(loginDB, 'findOne').mockResolvedValue({ email: validUser.email });

    const res = await request(app)
      .post('/auth/signup')
      .send(validUser);
      
    expect(res.statusCode).toEqual(400); // Controller uses 400 for existing user
    expect(res.body).toHaveProperty('success', false);
  });

  it('should successfully log in the user', async () => {
    const mockLoginUser = {
      _id: 'loginId123',
      email: validUser.email,
      password: 'hashedPassword',
      role: 'user'
    };
    
    jest.spyOn(loginDB, 'find').mockResolvedValue([mockLoginUser]); // Login searches via find
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token');

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: validUser.email,
        password: validUser.password
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with incorrect password', async () => {
    const mockLoginUser = {
      _id: 'loginId123',
      email: validUser.email,
      password: 'hashedPassword',
      role: 'user'
    };
    
    jest.spyOn(loginDB, 'find').mockResolvedValue([mockLoginUser]);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Wrong password

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: validUser.email,
        password: 'WrongPassword1!'
      });
      
    expect(res.statusCode).toEqual(400); // Controller uses 400 for invalid password
    expect(res.body).toHaveProperty('success', false);
  });

  describe('Password Reset Flow', () => {
    it('should generate an OTP on forgot password request', async () => {
      jest.spyOn(loginDB, 'findOne').mockResolvedValue({ 
        _id: 'loginId123', 
        email: validUser.email, 
        role: 'user',
        save: jest.fn().mockResolvedValue(true)
      });
      jest.spyOn(userDB, 'findOne').mockResolvedValue({ firstName: 'Test', lastName: 'User' });

      const res = await request(app)
        .post('/auth/forgot-password')
        .send({ email: validUser.email });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('OTP has been sent');
    });

    it('should successfully verify a valid OTP', async () => {
      const futureDate = new Date(Date.now() + 15 * 60 * 1000); // 15 mins in future
      jest.spyOn(loginDB, 'findOne').mockResolvedValue({ 
        email: validUser.email,
        resetPasswordOtp: '123456',
        resetPasswordExpires: futureDate
      });

      const res = await request(app)
        .post('/auth/verify-otp')
        .send({ email: validUser.email, otp: '123456' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
    });

    it('should successfully reset the password', async () => {
      const futureDate = new Date(Date.now() + 15 * 60 * 1000);
      const mockUser = {
        email: validUser.email,
        resetPasswordOtp: '123456',
        resetPasswordExpires: futureDate,
        save: jest.fn().mockResolvedValue(true)
      };
      
      jest.spyOn(loginDB, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword');

      const res = await request(app)
        .post('/auth/reset-password')
        .send({ 
          email: validUser.email, 
          otp: '123456', 
          newPassword: 'NewValidPass123!' 
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('Password reset successfully');
    });
  });
});

