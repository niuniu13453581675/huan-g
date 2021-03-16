function voicePrompt (text){
  new Audio('https://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ctp=1&pdt=301&vol=9&rate=32&per=0&tex=' + text).play();
}

export {
  voicePrompt
}