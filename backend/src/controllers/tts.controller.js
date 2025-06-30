import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import path from 'path';

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: path.resolve('config/cloudshelf-tts-config.json') // your downloaded key
});

export const speakText = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: 'Text is required' });

  const request = {
    input: { text },
    voice: {
      languageCode: 'en-US',
      ssmlGender: 'NEUTRAL',
    },
    audioConfig: {
      audioEncoding: 'MP3',
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.audioContent); // Stream audio directly
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ message: 'TTS failed' });
  }
};
