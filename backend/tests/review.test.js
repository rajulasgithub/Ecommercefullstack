import request from 'supertest';
import app from '../server.js';
import reviewDB from '../src/model/review.js';
import cartDB from '../src/model/cart.js';
import userDB from '../src/model/user.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

jest.mock('../src/model/review.js');
jest.mock('../src/model/cart.js');
jest.mock('../src/model/user.js');

describe('Review API', () => {
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
  });

  it('should get reviews for a product', async () => {
    const mockReviews = [
      { _id: 'rev123', rating: 5, comment: 'Great!', loginId: 'user123' }
    ];
    const mockSort = jest.fn().mockResolvedValue(mockReviews);
    jest.spyOn(reviewDB, 'find').mockReturnValue({ sort: mockSort });

    // Mock user lookup
    jest.spyOn(userDB, 'findOne').mockResolvedValue({ firstName: 'Test', lastName: 'User' });

    // Assuming a pipeline exists for aggregation in getProductReviews
    jest.spyOn(reviewDB, 'aggregate').mockResolvedValue([{ _id: null, avgRating: 5, count: 1 }]);

    const res = await request(app)
      .get(`/review/product/${validObjectId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should allow user to add a review', async () => {
    jest.spyOn(jwt, 'verify').mockReturnValue({ loginId: validObjectId, role: 'user' });

    jest.spyOn(reviewDB, 'findOne').mockResolvedValue(null);
    jest.spyOn(reviewDB.prototype, 'save').mockResolvedValue({ _id: 'rev123' });
    
    // We also mock cartDB since addReview checks if user bought it
    jest.spyOn(cartDB, 'find').mockResolvedValue([{ status: 2 }]); // Status 2 = ordered

    const res = await request(app)
      .post('/review/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId: validObjectId, rating: 4, comment: 'Good' });

    expect([200, 201]).toContain(res.statusCode);
  });
});
