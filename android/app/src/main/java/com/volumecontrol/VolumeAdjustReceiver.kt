package com.volumecontrol

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioManager

class VolumeAdjustReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val streamType = intent.getIntExtra("streamType", -1)
        val volumePercentage = intent.getIntExtra("volumePercentage", -1)

        if (streamType != -1 && volumePercentage != -1) {
            adjustVolume(context, streamType, volumePercentage)
        }
    }

    private fun adjustVolume(context: Context, streamType: Int, volumePercentage: Int) {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val maxVolume = audioManager.getStreamMaxVolume(streamType)
        val newVolume = (maxVolume * (volumePercentage / 100.0)).toInt()
        audioManager.setStreamVolume(streamType, newVolume, 0)
    }
}
