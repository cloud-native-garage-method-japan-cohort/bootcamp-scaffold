const express = require('express');

const AssistantV2 = require('ibm-watson/assistant/v2');
const DiscoveryV1 = require('ibm-watson/discovery/v1');
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

const discovery = new DiscoveryV1({
  version: config.get('watson.discovery.version'),
  authenticator: new IamAuthenticator({
    apikey: config.get('watson.discovery.apikey'),
  }),
  serviceUrl: config.get('watson.discovery.serviceUrl'),
});

const createQuery = (categoryLabel, searchStr) => {
  const texts = searchStr.split(' ').map((item) => `text:"${item}"`).join(',');
  return `enriched_text.categories.label::"${categoryLabel}",(${texts})`;
};

const runQuery = async (categoryLabel, searchStr) => {
  const query = createQuery(categoryLabel, searchStr);

  const queryParams = {
    environmentId: config.get('watson.discovery.environmentId'),
    collectionId: config.get('watson.discovery.collectionId'),
    highlight: true,
    query,
    _return: 'highlight',
  };

  console.log(`Running query - ${query}`);
  const queryResponse = await await discovery.query(queryParams);
  if (queryResponse.result.results && queryResponse.result.results.length > 0) {
    return queryResponse.result.results[0].highlight.text[0]
        .replace(/<em>/g, '')
        .replace(/<\/em>/g, '');
  } else {
    return '該当する情報が見つかりませんでした。';
  }
};

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

    let responseText;
    if (chatResponse.result.output.generic[0].text === 'app-discovery-disease') {
      responseText = await runQuery('/health and fitness/disease', req.body.message);
    } else if (chatResponse.result.output.generic[0].text === 'app-discovery-drink') {
      responseText = await runQuery('/food and drink/beverages/alcoholic beverages/cocktails and beer', req.body.message);
    } else {
      responseText = chatResponse.result.output.generic[0].text;
    }

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
