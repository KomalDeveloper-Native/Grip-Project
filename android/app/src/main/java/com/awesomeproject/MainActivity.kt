package com.awesomeproject

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

    // Declare the receiver globally so it can be unregistered later
    private val receiver = MyBroadcastReceiver()

    // Register the receiver dynamically in onCreate
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        SplashScreen.show(this)

        // Register the BroadcastReceiver dynamically
        registerMyReceiver(this)
    }

    // Unregister the receiver to avoid memory leaks
    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(receiver)
    }

    // Method to register the receiver dynamically
    private fun registerMyReceiver(context: Context) {
        val intentFilter = IntentFilter("com.awesomeproject.CUSTOM_ACTION")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            context.registerReceiver(receiver, intentFilter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            context.registerReceiver(receiver, intentFilter)
        }
    }

    // Return the main component name
    override fun getMainComponentName(): String = "AwesomeProject"

    // Override for custom React Activity Delegate
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName)

    // Inner class for the BroadcastReceiver
    class MyBroadcastReceiver : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            Log.d("MyBroadcastReceiver", "Received intent with action: ${intent.action}")
        }
    }
}
