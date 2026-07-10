package com.wealthbuilder.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.View
import android.webkit.*
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var errorLayout: FrameLayout
    private lateinit var tvErrorMsg: TextView
    private lateinit var btnRetry: Button

    private var uploadMessage: ValueCallback<Array<Uri>>? = null
    private var cameraPhotoPath: String? = null

    // Permissions registry
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val cameraGranted = permissions[Manifest.permission.CAMERA] ?: false
        val audioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false
        val locationGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] ?: false
        
        if (cameraGranted) {
            startCameraIntent()
        } else {
            Toast.makeText(this, "Camera permission required for snapshot upload", Toast.LENGTH_SHORT).show()
            cancelUpload()
        }
    }

    private val cameraResultLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val results = if (cameraPhotoPath != null) {
                arrayOf(Uri.parse(cameraPhotoPath))
            } else {
                null
            }
            uploadMessage?.onReceiveValue(results)
        } else {
            cancelUpload()
        }
        uploadMessage = null
    }

    private val fileResultLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val data: Intent? = result.data
            var results: Array<Uri>? = null
            if (data != null) {
                val dataString = data.dataString
                val clipData = data.clipData
                if (clipData != null) {
                    results = Array(clipData.itemCount) { i -> clipData.getItemAt(i).uri }
                } else if (dataString != null) {
                    results = arrayOf(Uri.parse(dataString))
                }
            }
            uploadMessage?.onReceiveValue(results)
        } else {
            cancelUpload()
        }
        uploadMessage = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize Native Views
        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        errorLayout = findViewById(R.id.errorLayout)
        tvErrorMsg = findViewById(R.id.tvErrorMsg)
        btnRetry = findViewById(R.id.btnRetry)

        setupWebView()
        setupBackNavigation()
        requestInitialPermissions()

        btnRetry.setOnClickListener {
            loadApp()
        }

        loadApp()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.mediaPlaybackRequiresUserGesture = false

        // Custom WebViewClient
        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
                errorLayout.visibility = View.GONE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                // Show offline/error screen only for main page failures
                if (request?.isForMainFrame == true) {
                    showErrorScreen("Unable to load Wealth Builder. Please check your internet connection and retry.")
                }
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false
                if (url.startsWith("file://") || url.startsWith("https://ais-") || url.startsWith("http://localhost")) {
                    return false
                }
                
                // Open external links in device browser (Google, Gumroad, OPay payment portals, etc.)
                try {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                    return true
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "No application can handle this link", Toast.LENGTH_SHORT).show()
                }
                return true
            }
        }

        // Custom WebChromeClient
        webView.webChromeClient = object : WebChromeClient() {
            // Loader updates
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                progressBar.progress = newProgress
                if (newProgress == 100) {
                    progressBar.visibility = View.GONE
                } else {
                    progressBar.visibility = View.VISIBLE
                }
            }

            // HTML5 Location Permissions Support
            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                callback?.invoke(origin, true, false)
            }

            // Dynamic Camera & Mic Permissions Support
            override fun onPermissionRequest(request: PermissionRequest?) {
                val resources = request?.resources ?: return
                val requestedPermissions = ArrayList<String>()
                for (resource in resources) {
                    if (resource == PermissionRequest.RESOURCE_VIDEO_CAPTURE) {
                        requestedPermissions.add(Manifest.permission.CAMERA)
                    } else if (resource == PermissionRequest.RESOURCE_AUDIO_CAPTURE) {
                        requestedPermissions.add(Manifest.permission.RECORD_AUDIO)
                    }
                }

                if (requestedPermissions.isNotEmpty()) {
                    // Automatically grant if already approved, otherwise delegate
                    request.grant(resources)
                } else {
                    request.deny()
                }
            }

            // File Chooser `<input type="file">` upload support
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                if (uploadMessage != null) {
                    uploadMessage?.onReceiveValue(null)
                    uploadMessage = null
                }
                uploadMessage = filePathCallback

                // Offer options to Take photo or pick from storage
                val takePhotoIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                if (takePhotoIntent.resolveActivity(packageManager) != null) {
                    var photoFile: File? = null
                    try {
                        photoFile = createTemporaryImageFile()
                    } catch (ex: IOException) {
                        ex.printStackTrace()
                    }
                    if (photoFile != null) {
                        val authorities = "$packageName.fileprovider"
                        val photoURI = FileProvider.getUriForFile(
                            this@MainActivity,
                            authorities,
                            photoFile
                        )
                        cameraPhotoPath = photoURI.toString()
                        takePhotoIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
                    }
                }

                val contentSelectionIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                    putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false)
                }

                val intentArray: Array<Intent> = if (takePhotoIntent.resolveActivity(packageManager) != null) {
                    arrayOf(takePhotoIntent)
                } else {
                    emptyArray()
                }

                val chooserIntent = Intent(Intent.ACTION_CHOOSER).apply {
                    putExtra(Intent.EXTRA_INTENT, contentSelectionIntent)
                    putExtra(Intent.EXTRA_TITLE, "Upload Receipts or Documents")
                    putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray)
                }

                fileResultLauncher.launch(chooserIntent)
                return true
            }
        }

        // Support downloads
        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
            try {
                val request = DownloadManager.Request(Uri.parse(url)).apply {
                    setMimeType(mimetype)
                    addRequestHeader("User-Agent", userAgent)
                    setDescription("Downloading document...")
                    setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype))
                    setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    setDestinationInExternalPublicDir(
                        Environment.DIRECTORY_DOWNLOADS,
                        URLUtil.guessFileName(url, contentDisposition, mimetype)
                    )
                }
                val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                dm.enqueue(request)
                Toast.makeText(this, "Download initiated...", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Toast.makeText(this, "Failed to download: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    private fun loadApp() {
        if (isNetworkAvailable()) {
            errorLayout.visibility = View.GONE
            webView.visibility = View.VISIBLE
            // Load compiled web app from assets
            webView.loadUrl("file:///android_asset/index.html")
        } else {
            showErrorScreen("No internet connection detected. Please enable mobile data or Wi-Fi and retry.")
        }
    }

    private fun showErrorScreen(message: String) {
        tvErrorMsg.text = message
        webView.visibility = View.GONE
        errorLayout.visibility = View.VISIBLE
        progressBar.visibility = View.GONE
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val activeNetwork = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    @Throws(IOException::class)
    private fun createTemporaryImageFile(): File {
        val timeStamp: String = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val imageFileName = "JPEG_" + timeStamp + "_"
        val storageDir: File? = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile(
            imageFileName,
            ".jpg",
            storageDir
        )
    }

    private fun startCameraIntent() {
        val takePhotoIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        var photoFile: File? = null
        try {
            photoFile = createTemporaryImageFile()
        } catch (ex: IOException) {
            ex.printStackTrace()
        }
        if (photoFile != null) {
            val photoURI = FileProvider.getUriForFile(
                this,
                "$packageName.fileprovider",
                photoFile
            )
            cameraPhotoPath = photoURI.toString()
            takePhotoIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
            cameraResultLauncher.launch(takePhotoIntent)
        }
    }

    private fun cancelUpload() {
        uploadMessage?.onReceiveValue(null)
        uploadMessage = null
    }

    private fun requestInitialPermissions() {
        val permissionsToRequest = ArrayList<String>()
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(Manifest.permission.CAMERA)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
        if (permissionsToRequest.isNotEmpty()) {
            requestPermissionLauncher.launch(permissionsToRequest.toTypedArray())
        }
    }
}
