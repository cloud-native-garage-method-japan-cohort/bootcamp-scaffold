const express = require('express');

const AssistantV2 = require('ibm-watson/assistant/v2');
const {IamAuthenticator} = require('ibm-watson/auth');
const config = require('config');

// eslint-disable-next-line new-cap
const router = express.Router();


// 接続情報
const assistant = new AssistantV2({
  version: config.get('watson.assistant.version'),
  authenticator: new IamAuthenticator({
    apikey: config.get('watson.assistant.apikey'),
  }),
  url: config.get('watson.assistant.url'),
  headers: {
    'X-Watson-Learning-Opt-Out': 'true',
  },
});
const assistantId = config.get('watson.assistant.assistantId');

router.get('/session', async (req, res) => {
  try {
    const sessionResponse = await assistant.createSession({
      assistantId: assistantId,
    });

    console.log(sessionResponse.result);

    res.json(sessionResponse.result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to call watson service');
  }
});

router.post('/message', async (req, res) => {
  try {
    if (!req.body.sessionId || !req.body.message) {
      res.status(400).send('Missing sessionId/message.');
      return;
    }

    const chatResponse = await assistant.message({
      assistantId: assistantId,
      sessionId: req.body.sessionId,
      input: {
        message_type: 'text',
        text: req.body.message,
      },
    });

    const responseText = chatResponse.result.output.generic[0].text;

    res.json({
      responseText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to call watson service');
  }
});

router.delete('/session/:sessionId', async (req, res) => {
  try {
    const delResponse = await assistant.deleteSession({
      assistantId: assistantId,
      sessionId: req.params.sessionId,
    });

    res.json(delResponse.result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to call watson service');
  }
});

module.exports = router;
