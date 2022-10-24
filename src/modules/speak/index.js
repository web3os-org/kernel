// TODO: Move this to the recognition module when it's ready
// const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
// const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

import arg from 'arg'
import { parse as cliParse } from 'shell-quote'

export const name = 'speak'
export const description = 'Speech Synthesis Utility'
export const help = `
  Speech Synthesis Utility

  Usage:
    speak <phrase> [options]

  Options:
    --help                                    Print this help message
    --list-voices                             Output the supported voices
    --pitch                                   Pitch (0-2) {1}
    --rate                                    Rate (0-2) {1}
    --reset                                   Perform a speechSynthesis.cancel()
    --version                                 Print the version information
    --voice                                   Name of the voice to use
    --voice-index                             Index of the voice to use
    --volume                                  Volume (0-2) {1}
`

export const spec = {
  '--help': Boolean,
  '--list-voices': Boolean,
  '--pitch': Number,
  '--rate': Number,
  '--reset': Boolean,
  '--version': Boolean,
  '--voice': String,
  '--voice-index': Number,
  '--volume': Number
}

export let voices = speechSynthesis.getVoices()
speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices()
}

export function getUtterance (text, voice, volume = 1, pitch = 1, rate = 1) {
  const utter = new SpeechSynthesisUtterance(text)
  utter.default = false
  utter.voice = voice
  utter.volume = volume
  utter.pitch = pitch
  utter.rate = rate
  // console.log({ text, voice, volume, pitch, rate, utter })
  return utter
}

export function speak (utterance) {
  return speechSynthesis.speak(utterance)
}

export async function run (term, context) {
  const args = arg(spec, { argv: cliParse(context) })
  if (args['--version']) return term.log(version)
  if (args['--help']) return term.log(help)
  if (args['--list-voices']) return term.log(voices.map(v => v.name))
  if (args['--reset']) return speechSynthesis.cancel()

  args.terminal = term
  args.kernel = term.kernel

  let voice = voices.find(v => v.name.toLowerCase() === args['--voice']?.toLowerCase())
  if (typeof args['--voice-index'] === 'number') voice = voices[args['--voice-index']]

  const utter = getUtterance(args._?.[0], voice, args['--volume'], args['--pitch'], args['--rate'])
  return speak(utter)
}
