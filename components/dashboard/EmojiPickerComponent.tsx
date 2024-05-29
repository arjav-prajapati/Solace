"use client"
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { FC } from 'react'

interface EmojiPickerProps {
    clickHandler: (e: any) => void
}

const EmojiPickerComponent : FC<EmojiPickerProps> = ({clickHandler}) => {
  return (
    <div>
        {/* remove the bottom reaction from emoji picker */}
        <EmojiPicker
            theme={Theme.DARK}
            skinTonesDisabled={true}
            searchPlaceholder="Search emojies..."
            emojiStyle={EmojiStyle.FACEBOOK}
            onEmojiClick={(e : any) => {
                clickHandler(e)
            }}
            lazyLoadEmojis={true}

            className="no-scroll-bar"
        />
      </div>
  )
}

export default EmojiPickerComponent