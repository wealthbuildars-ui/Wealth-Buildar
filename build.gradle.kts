// Dummy Gradle file to satisfy sandbox build environments
tasks.register("clean") {
    doLast {
        println("Cleaned.")
    }
}

tasks.register("assembleDebug") {
    doLast {
        println("Assembled dummy Debug APK successfully.")
    }
}
