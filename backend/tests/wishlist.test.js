import request from 'supertest';
import app from '../server.js';
import wishlistDB from '../src/model/wishlist.js';
import productDB from '../src/model/product.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

jest.mock('../src/model/wishlist.js');
jest.mock('../src/model/product.js');

describe('Wishlist API', () => {
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

  it('should add an item to the wishlist successfully', async () => {
    jest.spyOn(productDB, 'findOne').mockResolvedValue({ _id: validObjectId });
    jest.spyOn(wishlistDB, 'findOne').mockResolvedValue(null);
    jest.spyOn(wishlistDB.prototype, 'save').mockResolvedValue({ _id: 'wish123' });

    const res = await request(app)
      .post('/wishlist/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId: validObjectId });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should fetch the user wishlist', async () => {
    const mockPopulate = jest.fn().mockResolvedValue([
      { _id: 'wish123', prdId: validObjectId }
    ]);
    jest.spyOn(wishlistDB, 'find').mockReturnValue({ populate: mockPopulate });

    const res = await request(app)
      .get('/wishlist/view')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
