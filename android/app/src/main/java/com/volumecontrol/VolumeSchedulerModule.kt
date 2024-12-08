package com.volumecontrol

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.*
import org.json.JSONObject
import java.util.Calendar

class VolumeSchedulerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Store schedule metadata in a map
    private val scheduleMap: MutableMap<Int, Map<String, Any>> = mutableMapOf()

    override fun getName(): String {
        return "VolumeScheduler"
    }

    @ReactMethod
    fun scheduleAdjustment(
        id: Int,
        hour: Int,
        minute: Int,
        volumeLevels: ReadableMap,
        vibrationMode: Boolean,
        days: ReadableArray?,
        promise: Promise
    ) {
        try {
            val volumeMap = volumeLevels.toHashMap() as Map<Any?, Any?>
            val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            if (days == null || days.size() == 0) {
                // One-time schedule
                val calendar = Calendar.getInstance().apply {
                    set(Calendar.HOUR_OF_DAY, hour)
                    set(Calendar.MINUTE, minute)
                    set(Calendar.SECOND, 0)

                    if (timeInMillis <= System.currentTimeMillis()) {
                        add(Calendar.DAY_OF_YEAR, 1)
                    }
                }

                val intent = Intent(reactContext, VolumeAdjustReceiver::class.java).apply {
                    putExtra("volumeLevels", JSONObject(volumeMap).toString())
                    putExtra("vibrationMode", vibrationMode)
                }

                val pendingIntent = PendingIntent.getBroadcast(
                    reactContext,
                    id,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pendingIntent)

                // Add to schedule map
                scheduleMap[id] = mapOf(
                    "id" to id,
                    "hour" to hour,
                    "minute" to minute,
                    "volumeLevels" to volumeMap,
                    "vibrationMode" to vibrationMode,
                    "days" to emptyList<String>()
                )
            } else {
                // Weekly schedule
                for (i in 0 until days.size()) {
                    val day = days.getString(i)?.uppercase() ?: continue
                    val targetDay = when (day) {
                        "SUNDAY" -> Calendar.SUNDAY
                        "MONDAY" -> Calendar.MONDAY
                        "TUESDAY" -> Calendar.TUESDAY
                        "WEDNESDAY" -> Calendar.WEDNESDAY
                        "THURSDAY" -> Calendar.THURSDAY
                        "FRIDAY" -> Calendar.FRIDAY
                        "SATURDAY" -> Calendar.SATURDAY
                        else -> continue
                    }

                    val calendar = Calendar.getInstance().apply {
                        set(Calendar.DAY_OF_WEEK, targetDay)
                        set(Calendar.HOUR_OF_DAY, hour)
                        set(Calendar.MINUTE, minute)
                        set(Calendar.SECOND, 0)

                        if (timeInMillis <= System.currentTimeMillis()) {
                            add(Calendar.WEEK_OF_YEAR, 1)
                        }
                    }

                    val intent = Intent(reactContext, VolumeAdjustReceiver::class.java).apply {
                        putExtra("volumeLevels", JSONObject(volumeMap).toString())
                        putExtra("vibrationMode", vibrationMode)
                    }

                    val pendingIntent = PendingIntent.getBroadcast(
                        reactContext,
                        id + targetDay,
                        intent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pendingIntent)
                }

                // Add to schedule map
                scheduleMap[id] = mapOf(
                    "id" to id,
                    "hour" to hour,
                    "minute" to minute,
                    "volumeLevels" to volumeMap,
                    "vibrationMode" to vibrationMode,
                    "days" to (days.toArrayList() as List<String>)
                )
            }

            promise.resolve("Schedule created successfully with ID: $id")
        } catch (e: Exception) {
            promise.reject("SCHEDULE_ERROR", "Failed to schedule adjustment", e)
        }
    }

    @ReactMethod
    fun getSchedules(promise: Promise) {
        try {
            promise.resolve(Arguments.makeNativeArray(scheduleMap.values.toList()))
        } catch (e: Exception) {
            promise.reject("GET_SCHEDULES_ERROR", "Failed to retrieve schedules", e)
        }
    }

    @ReactMethod
    fun cancelSchedule(id: Int, promise: Promise) {
        try {
            val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(reactContext, VolumeAdjustReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                reactContext,
                id,
                intent,
                PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
            )
            pendingIntent?.let { alarmManager.cancel(it) }
            scheduleMap.remove(id) // Remove from schedule map
            promise.resolve("Schedule with ID: $id canceled successfully")
        } catch (e: Exception) {
            promise.reject("CANCEL_ERROR", "Failed to cancel schedule", e)
        }
    }

    @ReactMethod
    fun editSchedule(
        id: Int,
        hour: Int,
        minute: Int,
        volumeLevels: ReadableMap,
        vibrationMode: Boolean,
        days: ReadableArray?,
        promise: Promise
    ) {
        try {
            cancelSchedule(id, PromiseImpl(null, null)) // Cancel existing schedule
            scheduleAdjustment(id, hour, minute, volumeLevels, vibrationMode, days, promise) // Create new schedule
        } catch (e: Exception) {
            promise.reject("EDIT_ERROR", "Failed to edit schedule", e)
        }
    }
}
