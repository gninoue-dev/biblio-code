import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities

// Vrai si l'appareil a un accès Internet qui fonctionne réellement.
fun Context.estConnecte(): Boolean {
    val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    val capacites = cm.getNetworkCapabilities(cm.activeNetwork) ?: return false
    return capacites.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
        capacites.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
}
