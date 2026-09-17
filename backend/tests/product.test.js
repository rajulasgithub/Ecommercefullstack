import request from 'supertest';
import app from '../server.js';
import productDB from '../src/model/product.js';
import loginDB from '../src/model/login.js';
import companyDB from '../src/model/company.js';
import userDB from '../src/model/user.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

jest.mock('../src/model/product.js');
jest.mock('../src/model/login.js');
jest.mock('../src/model/company.js');
jest.mock('../src/model/user.js');


describe('Product API', () => {
  const validObjectId = '507f1f77bcf86cd799439011';
  
  const validProduct = {
    prdName: 'Test Shirt',
    category: 'Men',
    style: 'Casual Wear', // Make sure it matches STYLES in product.js
    description: 'This is a test shirt description.',
    prize: '19.99',
    stock: 'In Stock',
    size: 'M',
    material: 'Cotton'
  };

  const mockProductResponse = {
    _id: validObjectId,
    ...validProduct,
    status: 'Available',
    loginId: 'seller123',
    image: ['test-image.jpg']
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Public Routes', () => {
    it('should fetch all products successfully', async () => {
      // Mock countDocuments
      jest.spyOn(productDB, 'countDocuments').mockResolvedValue(1);
      
      // Mock the chain find().sort().skip().limit()
      const mockLimit = jest.fn().mockResolvedValue([mockProductResponse]);
      const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
      jest.spyOn(productDB, 'find').mockReturnValue({ sort: mockSort });

      const res = await request(app).get('/product/viewproduct');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
    });

    it('should fetch a single product by ID', async () => {
      jest.spyOn(productDB, 'findOne').mockResolvedValue(mockProductResponse);

      const res = await request(app).get(`/product/viewone/${validObjectId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.prdName).toEqual('Test Shirt');
    });
  });

  describe('Protected Routes (Seller)', () => {
    let sellerToken;

    beforeAll(() => {
      sellerToken = jwt.sign(
        { loginId: 'seller123', role: 'seller', email: 'seller@test.com' },
        process.env.JWT_SECRET || 'encryptkey',
        { expiresIn: '1h' }
      );
    });

    it('should allow a seller to add a product', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({
        loginId: 'seller123',
        role: 'seller'
      });

      // Mock save
      jest.spyOn(productDB.prototype, 'save').mockResolvedValue(mockProductResponse);
      
      // Mock other DBs accessed by getSellerInfo
      jest.spyOn(loginDB, 'findById').mockResolvedValue(null);
      jest.spyOn(companyDB, 'findOne').mockResolvedValue(null);
      jest.spyOn(userDB, 'findOne').mockResolvedValue(null);

      const res = await request(app)
        .post('/product/addproduct')
        .set('Authorization', `Bearer ${sellerToken}`)
        .field('prdName', validProduct.prdName)
        .field('category', validProduct.category)
        .field('style', validProduct.style)
        .field('description', validProduct.description)
        .field('prize', validProduct.prize)
        .field('stock', validProduct.stock)
        .field('size', validProduct.size)
        .field('material', validProduct.material)
        .attach('image', Buffer.from('fake image data'), 'test.jpg'); 
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toContain('Product added successfully');
    });

    it('should prevent non-sellers from adding a product', async () => {
      const userToken = jwt.sign(
        { loginId: 'user123', role: 'user', email: 'user@test.com' },
        process.env.JWT_SECRET || 'encryptkey',
        { expiresIn: '1h' }
      );

      jest.spyOn(jwt, 'verify').mockReturnValue({
        loginId: 'user123',
        role: 'user' 
      });

      const res = await request(app)
        .post('/product/addproduct')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validProduct);
        
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('error', true);
    });
  });
});
