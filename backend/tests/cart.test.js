import request from 'supertest';
import app from '../server.js';
import cartDB from '../src/model/cart.js';
import productDB from '../src/model/product.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

jest.mock('../src/model/cart.js');
jest.mock('../src/model/product.js');

describe('Cart API', () => {
  const validObjectId = '507f1f77bcf86cd799439011';
  let userToken;

  beforeAll(() => {
    userToken = jwt.sign(
      { loginId: 'user123', role: 'user', email: 'user@test.com' },
      process.env.JWT_SECRET || 'encryptkey',
      { expiresIn: '1h' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(jwt, 'verify').mockReturnValue({ loginId: 'user123', role: 'user' });
  });

  it('should add an item to the cart successfully', async () => {
    // Mock the product validation in controller
    jest.spyOn(productDB, 'findOne').mockResolvedValue({ _id: validObjectId, prize: 19.99 });
    
    // Mock findOne to simulate item not in cart yet
    jest.spyOn(cartDB, 'findOne').mockResolvedValue(null);
    
    // Mock save
    jest.spyOn(cartDB.prototype, 'save').mockResolvedValue({ _id: 'cart123', prdId: validObjectId, quantity: 1 });

    const res = await request(app)
      .post('/cart/addtocart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId: validObjectId });

    // The controller might use 200 or 201
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should fetch the cart for the user', async () => {
    const mockPopulate = jest.fn().mockResolvedValue([
      { _id: 'cart123', prdId: validObjectId, quantity: 1 }
    ]);
    jest.spyOn(cartDB, 'find').mockReturnValue({ populate: mockPopulate });

    const res = await request(app)
      .get('/cart/viewcart')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
