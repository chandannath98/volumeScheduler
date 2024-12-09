package com.volumecontrol

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import org.json.JSONObject

class VolumeAdjustReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val volumeLevels = JSONObject(intent.getStringExtra("volumeLevels") ?: "{}")
        val vibrationMode = intent.getBooleanExtra("vibrationMode", false)

        // Function to set volume based on percentage
        fun setVolumePercentage(streamType: Int, percentage: Int) {
            val maxVolume = audioManager.getStreamMaxVolume(streamType)
            val volume = (maxVolume * (percentage / 100.0)).toInt()
        
            // Logging max volume and percentage
            println("Stream Type: $streamType")
            println("Max Volume: $maxVolume")
            println("Percentage: $percentage")
            println("Calculated Volume: $volume")
        
            audioManager.setStreamVolume(streamType, volume, AudioManager.FLAG_ALLOW_RINGER_MODES)
        }
        

        // Set volumes for each stream type if provided
        volumeLevels.optInt("media", -1).takeIf { it in 0..100 }?.let {
            setVolumePercentage(AudioManager.STREAM_MUSIC, it)
        }
        volumeLevels.optInt("ring", -1).takeIf { it in 0..100 }?.let {
            setVolumePercentage(AudioManager.STREAM_RING, it)
        }
        volumeLevels.optInt("alarm", -1).takeIf { it in 0..100 }?.let {
            setVolumePercentage(AudioManager.   STREAM_ALARM, it)
        }
        volumeLevels.optInt("notification", -1).takeIf { it in 0..100 }?.let {
            setVolumePercentage(AudioManager.STREAM_NOTIFICATION, it)
        }

        // Set vibration mode if enabled
        // if (vibrationMode) {
        //     audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
        // }
    }
}
