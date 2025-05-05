import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../app';

describe('Health and Default API Routes', () => {
  describe('GET /api/health', () => {
    it('should return 200 status and health information', async () => {
      // Act
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('status', 'ok');
      expect(response.body).to.have.property('timestamp');
      
      // Verify timestamp is a valid date
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).to.be.an.instanceOf(Date);
      expect(isNaN(timestamp.getTime())).to.be.false;
    });
  });

  describe('GET /api', () => {
    it('should return 200 status and API information', async () => {
      // Act
      const response = await request(app)
        .get('/api')
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.include('Weird Salads Inventory API');
      expect(response.body).to.have.property('documentation');
      expect(response.body.documentation).to.equal('/api-docs');
    });
  });

  describe('GET /api/non-existent-route', () => {
    it('should return 404 status for non-existent routes', async () => {
      // Act & Assert
      await request(app)
        .get('/api/non-existent-route')
        .expect(404);
    });
  });
});
