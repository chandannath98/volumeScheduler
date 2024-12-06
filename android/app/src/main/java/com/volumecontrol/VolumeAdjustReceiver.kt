package com.volumecontrol

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioManager

class VolumeAdjustReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val streamType = intent.getIntExtra("streamType", AudioManager.STREAM_MUSIC)
        val volumePercentage = intent.getIntExtra("volumePercentage", 0) // Default to 0%

        // Convert percentage to device-specific volume level
        val maxVolume = audioManager.getStreamMaxVolume(streamType)
        val volumeLevel = (maxVolume * (volumePercentage / 100.0)).toInt()

        // Set the specified stream volume to the calculated level
        audioManager.setStreamVolume(streamType, volumeLevel, AudioManager.FLAG_SHOW_UI)
    }
}
