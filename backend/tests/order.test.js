import request from 'supertest';
import app from '../server.js';
import cartDB from '../src/model/cart.js';
import addressDB from '../src/model/address.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

jest.mock('../src/model/cart.js');
jest.mock('../src/model/address.js');

describe('Order API', () => {
  const validObjectId = '507f1f77bcf86cd799439011';
  let userToken;
  let sellerToken;

  beforeAll(() => {
    userToken = jwt.sign(
      { loginId: 'user123', role: 'user', email: 'user@test.com' },
      process.env.JWT_SECRET || 'encryptkey',
      { expiresIn: '1h' }
    );
    
    sellerToken = jwt.sign(
      { loginId: 'seller123', role: 'seller', email: 'seller@test.com' },
      process.env.JWT_SECRET || 'encryptkey',
      { expiresIn: '1h' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('User Orders', () => {
    it('should fetch user orders successfully', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({ loginId: 'user123', role: 'user' });

      // Mock countDocuments
      jest.spyOn(cartDB, 'countDocuments').mockResolvedValue(1);

      // Mock the populate chain for cartDB
      const mockPopulate = jest.fn().mockResolvedValue([
        { _id: validObjectId, status: 2, quantity: 1 }
      ]);
      const mockLimit = jest.fn().mockReturnValue({ populate: mockPopulate });
      const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
      jest.spyOn(cartDB, 'find').mockReturnValue({ sort: mockSort });

      const res = await request(app)
        .get('/order/vieworderuser')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
    });

    it('should allow user to checkout (update cart to order)', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({ loginId: 'user123', role: 'user' });

      // Mock address findOne
      jest.spyOn(addressDB, 'findOne').mockResolvedValue({
        address: '123 Fake St', state: 'NY', district: 'NY', pincode: 10001, BuildingNumber: 1
      });

      // Checkout sets cart status to 2 for items in cart (status 1)
      jest.spyOn(cartDB, 'updateMany').mockResolvedValue({ modifiedCount: 1 });

      const res = await request(app)
        .put('/order/updatecart')
        .set('Authorization', `Bearer ${userToken}`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('Order placed successfully');
    });

    it('should allow user to cancel an order', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({ loginId: 'user123', role: 'user' });

      jest.spyOn(cartDB, 'updateOne').mockResolvedValue({ modifiedCount: 1 });

      const res = await request(app)
        .put(`/order/cancelorder/${validObjectId}`)
        .set('Authorization', `Bearer ${userToken}`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('Order cancelled successfully');
    });
  });

  describe('Seller Orders', () => {
    it('should prevent user from accessing seller orders', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({ loginId: 'user123', role: 'user' });

      const res = await request(app)
        .get('/order/viewsellerorders')
        .set('Authorization', `Bearer ${userToken}`);
        
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('error', true);
    });

    it('should allow seller to update order status', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({ loginId: 'seller123', role: 'seller' });

      jest.spyOn(cartDB, 'updateOne').mockResolvedValue({ modifiedCount: 1 });

      const res = await request(app)
        .put(`/order/updatecartstatus/${validObjectId}/3`) // status 3 = Shipped
        .set('Authorization', `Bearer ${sellerToken}`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('Order status updated');
    });
  });
});
