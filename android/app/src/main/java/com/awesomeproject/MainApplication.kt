package com.awesomeproject

import android.app.Application
import android.content.Context
import android.content.IntentFilter
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import android.util.Log

class MainApplication : Application(), ReactApplication {

  // Define the receiver as a property so it can be unregistered later
  private val receiver = MyBroadcastReceiver()

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)

    // Register the BroadcastReceiver when the application is created
    registerMyReceiver(this)

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }

  // Helper function to register the broadcast receiver
  private fun registerMyReceiver(context: Context) {
    val intentFilter = IntentFilter("com.awesomeproject.CUSTOM_ACTION")

    // Android 14 or higher
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      context.registerReceiver(receiver, intentFilter, Context.RECEIVER_NOT_EXPORTED)
    } else {
      // For Android versions below 14
      context.registerReceiver(receiver, intentFilter)
    }
  }

  // Inner class for the BroadcastReceiver
  class MyBroadcastReceiver : android.content.BroadcastReceiver() {
    override fun onReceive(context: Context, intent: android.content.Intent) {
      Log.d("MyBroadcastReceiver", "Received intent with action: ${intent.action}")
    }
  }
}
