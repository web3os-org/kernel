// TODO: Move this to the recognition module when it's ready
// const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
// const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

export const name = 'speak'
export const description = 'Speech Synthesis Utility'

export const voices = speechSynthesis.getVoices()

export function getUtterance (text, voice, volume = 1, pitch = 1, rate = 1) {
  const utter = new SpeechSynthesisUtterance(text)
  utter.voice = voice
  utter.volume = volume
  utter.pitch = pitch
  utter.rate = rate
  return utter
}

export function speak (utterance) {
  return speechSynthesis.speak(utterance)
}

export async function run (term, context) {
  console.log({ voices })
  for (const voice of speechSynthesis.getVoices()) {
    console.log('Voice:', voice.name, voice.lang)
    speak(getUtterance(context, voice, 1, _.random(0.1,2), _.random(0.1,2)))
  }

  // For testing and hilarity
  // for (const voice of voices) {
  //   speak(getUtterance(context, voice, 1, _.random(0.1,2), _.random(0.1,2)))
  // }
}
