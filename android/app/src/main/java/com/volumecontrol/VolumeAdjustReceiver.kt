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

        volumeLevels.optInt("media")?.let { audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, it, 0) }
        volumeLevels.optInt("ring")?.let { audioManager.setStreamVolume(AudioManager.STREAM_RING, it, 0) }
        volumeLevels.optInt("alarm")?.let { audioManager.setStreamVolume(AudioManager.STREAM_ALARM, it, 0) }
        volumeLevels.optInt("notification")?.let { audioManager.setStreamVolume(AudioManager.STREAM_NOTIFICATION, it, 0) }

        if (vibrationMode) {
            audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
        }
    }
}
