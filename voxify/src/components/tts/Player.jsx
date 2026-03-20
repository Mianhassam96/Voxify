import { memo } from 'react'
import { Button } from '../ui/Button'

export const Player = memo(function Player({ isSpeaking, isPaused, onPlay, onPause, onResume, onStop, disabled }) {
  return (
    <div className="flex items-center gap-2">
      {!isSpeaking ? (
        <Button
          onClick={onPlay}
          disabled={disabled}
          className="flex-1 py-3.5 text-base"
        >
          ▶ Smart Play
        </Button>
      ) : (
        <>
          {isPaused ? (
            <Button onClick={onResume} className="flex-1 py-3.5 text-base">
              ▶ Resume
            </Button>
          ) : (
            <Button onClick={onPause} variant="secondary" className="flex-1 py-3.5 text-base">
              ⏸ Pause
            </Button>
          )}
          <Button onClick={onStop} variant="danger" className="py-3.5 px-5">
            ■ Stop
          </Button>
        </>
      )}
    </div>
  )
})
