const chai = require('chai');
const request = require('supertest');

const should = chai.should();

const app = require('../../app');

let sessionId = null;

describe('GET /chat/session', () => {
  it('should return session object', async () => {
    const res = await request(app)
        .get('/chat/session');

    res.status.should.equal(200);
    should.exist(res.body.session_id);
    sessionId = res.body.session_id;
  });
});

describe('POST /chat/message', () => {
  it('should return output text', async () => {
    let res = await request(app)
        .post('/chat/message')
        .send({
          sessionId: sessionId,
          message: 'こんにちは',
        });

    res.status.should.equal(200);
    console.log(res.body.responseText);
    should.exist(res.body.responseText);

    res = await request(app)
        .post('/chat/message')
        .send({
          sessionId: sessionId,
          message: '病気について教えて',
        });
    res.status.should.equal(200);
    console.log(res.body.responseText);
    should.exist(res.body.responseText);

    res = await request(app)
        .post('/chat/message')
        .send({
          sessionId: sessionId,
          message: 'コロナ 症状',
        });
    res.status.should.equal(200);
    console.log(res.body.responseText);
    should.exist(res.body.responseText);
  });
});

describe('DELETE /chat/session', () => {
  it('should delete session object', async () => {
    const res = await request(app)
        .delete(`/chat/session/${sessionId}`);

    res.status.should.equal(200);
  });
});
