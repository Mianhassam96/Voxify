import { useDownload } from '../../hooks/useDownload'
import { Button } from '../ui/Button'

export function DownloadButton({ onRequestPlay, isSpeaking, text }) {
  const { isRecording, startRecording, stopAndDownload } = useDownload()

  const handleClick = async () => {
    if (isRecording) {
      stopAndDownload('voxify-speech.webm')
      return
    }

    const started = await startRecording()
    if (!started) {
      alert('Could not start recording. Please allow screen/tab audio sharing when prompted.')
      return
    }
    // Kick off speech after recording starts
    onRequestPlay()
  }

  // Auto-stop recording when speech ends
  if (isRecording && !isSpeaking && text) {
    // slight delay so last chunk is captured
    setTimeout(() => stopAndDownload('voxify-speech.webm'), 400)
  }

  return (
    <Button
      variant={isRecording ? 'danger' : 'secondary'}
      onClick={handleClick}
      disabled={!text.trim()}
      className="flex items-center gap-2"
      title="Record speech and download as audio"
    >
      {isRecording ? '⏹ Stop & Save' : '⬇ Download Audio'}
    </Button>
  )
}
