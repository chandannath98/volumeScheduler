package com.volumecontrol

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.os.VibrationEffect
import android.os.Vibrator
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import java.util.Calendar

class VolumeSchedulerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "VolumeScheduler"
    }

    @ReactMethod
    fun scheduleMute(hour: Int, minute: Int, volumePercentage: Int, days: ReadableArray?) {
        scheduleVolumeAdjustment(hour, minute, AudioManager.STREAM_MUSIC, volumePercentage, days)
    }

    @ReactMethod
    fun scheduleRingVolume(hour: Int, minute: Int, volumePercentage: Int, days: ReadableArray?) {
        scheduleVolumeAdjustment(hour, minute, AudioManager.STREAM_RING, volumePercentage, days)
    }

    @ReactMethod
    fun scheduleAlarmVolume(hour: Int, minute: Int, volumePercentage: Int, days: ReadableArray?) {
        scheduleVolumeAdjustment(hour, minute, AudioManager.STREAM_ALARM, volumePercentage, days)
    }

    @ReactMethod
    fun scheduleNotificationVolume(hour: Int, minute: Int, volumePercentage: Int, days: ReadableArray?) {
        scheduleVolumeAdjustment(hour, minute, AudioManager.STREAM_NOTIFICATION, volumePercentage, days)
    }

    @ReactMethod
    fun toggleVibrationMode(enabled: Boolean) {
        val audioManager = reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        if (enabled) {
            audioManager.ringerMode = AudioManager.RINGER_MODE_VIBRATE
        } else {
            audioManager.ringerMode = AudioManager.RINGER_MODE_NORMAL
        }
    }

    private fun scheduleVolumeAdjustment(
        hour: Int,
        minute: Int,
        streamType: Int,
        volumePercentage: Int,
        days: ReadableArray?
    ) {
        val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        if (days == null || days.size() == 0) {
            // Schedule for the next occurrence of the time
            val calendar = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, hour)
                set(Calendar.MINUTE, minute)
                set(Calendar.SECOND, 0)

                if (timeInMillis <= System.currentTimeMillis()) {
                    add(Calendar.DAY_OF_YEAR, 1)
                }
            }

            val intent = Intent(reactContext, VolumeAdjustReceiver::class.java).apply {
                putExtra("streamType", streamType)
                putExtra("volumePercentage", volumePercentage)
            }
            val pendingIntent = PendingIntent.getBroadcast(
                reactContext,
                streamType,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pendingIntent)
        } else {
            for (i in 0 until days.size()) {
                val day = days.getString(i)?.uppercase()

                if (day == null) continue

                val targetDay = when (day) {
                    "SUNDAY" -> Calendar.SUNDAY
                    "MONDAY" -> Calendar.MONDAY
                    "TUESDAY" -> Calendar.TUESDAY
                    "WEDNESDAY" -> Calendar.WEDNESDAY
                    "THURSDAY" -> Calendar.THURSDAY
                    "FRIDAY" -> Calendar.FRIDAY
                    "SATURDAY" -> Calendar.SATURDAY
                    else -> null
                }

                if (targetDay == null) continue

                val calendar = Calendar.getInstance().apply {
                    set(Calendar.HOUR_OF_DAY, hour)
                    set(Calendar.MINUTE, minute)
                    set(Calendar.SECOND, 0)

                    val currentDay = get(Calendar.DAY_OF_WEEK)
                    val daysUntilTarget = (targetDay - currentDay + 7) % 7
                    add(Calendar.DAY_OF_YEAR, if (daysUntilTarget == 0 && timeInMillis <= System.currentTimeMillis()) 7 else daysUntilTarget)
                }

                val intent = Intent(reactContext, VolumeAdjustReceiver::class.java).apply {
                    putExtra("streamType", streamType)
                    putExtra("volumePercentage", volumePercentage)
                    putExtra("day", day)
                }
                val pendingIntent = PendingIntent.getBroadcast(
                    reactContext,
                    day.hashCode() + streamType,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )

                alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pendingIntent)
            }
        }
    }
}
