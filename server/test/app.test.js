const request = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;

describe('POST /api/generate-caption', () => {
    it('should return a caption', (done) => {
        request(app)
            .post('/api/generate-caption')
            .attach('image', 'C:/Users/dvedr/OneDrive/Desktop/Assignments/SIT725/newprac6.2-725/server/Uploads/1724921097342.jpg')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('caption');
                done();
            });
    });
});
