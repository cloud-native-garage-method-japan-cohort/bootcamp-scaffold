const AssistantV2 = require('ibm-watson/assistant/v2');
const {IamAuthenticator} = require('ibm-watson/auth');
const config = require('config');

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

const exec = async () => {
  // 送信会話データ
  const texts = [
    'こんにちは',
    '元気ですか？',
    'ばいばい',
  ];

  let sessionId = null;
  try {
    // セッション作成
    const sessionResponse = await assistant.createSession({
      assistantId: assistantId,
    });

    sessionId = sessionResponse.result.session_id;

    // ループで会話
    for (const text of texts) {
      console.log(`送信:${text}`);
      const chatResponse = await assistant.message({
        assistantId: assistantId,
        sessionId: sessionId,
        input: {
          message_type: 'text',
          text: text,
        },
      });
      const recvText = chatResponse.result.output.generic[0].text;
      console.log(`受信:${recvText}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    // セッション削除
    if (sessionId) {
      await assistant.deleteSession({
        assistantId: assistantId,
        sessionId: sessionId,
      });
    }
  }
};

exec();
