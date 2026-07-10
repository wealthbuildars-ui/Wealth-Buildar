plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.wealthbuilder.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.wealthbuilder.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.activity.ktx)
}

// Automatically build Vite app and copy static assets into the Android assets folder during pre-build
val buildWebAssets = tasks.register<Exec>("buildWebAssets") {
    workingDir = file("${project.rootDir}")
    if (System.getProperty("os.name").toLowerCase().contains("windows")) {
        commandLine("cmd", "/c", "npm run build")
    } else {
        commandLine("npm", "run", "build")
    }
}

val copyWebAssets = tasks.register<Copy>("copyWebAssets") {
    dependsOn(buildWebAssets)
    from(file("${project.rootDir}/dist"))
    into(file("${projectDir}/src/main/assets"))
}

tasks.named("preBuild") {
    dependsOn(copyWebAssets)
}
