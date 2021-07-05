const chai = require('chai');
const request = require('supertest');

const should = chai.should();

const app = require('../../app');

let sessionId = null;


describe('POST /discovery/message', () => {
  it('should return output text', async () => {
    let res = await request(app)
        .post('/discovery/message')
        .send({
          sessionId: sessionId,
          message: 'コロナ',
        });

    res.status.should.equal(200);
    console.log(res.body.responseText);
    should.exist(res.body.responseText);
  });
});
