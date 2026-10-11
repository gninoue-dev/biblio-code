import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat

class MainActivity : ComponentActivity() {
    private val demandePermission =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { accordee ->
            if (!accordee) {
                // Expliquer à l'utilisateur à quoi servent les notifications.
            }
        }

    private fun demanderPermissionNotifications() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return
        val dejaAccordee = ContextCompat.checkSelfPermission(
            this, Manifest.permission.POST_NOTIFICATIONS
        ) == PackageManager.PERMISSION_GRANTED
        if (!dejaAccordee) demandePermission.launch(Manifest.permission.POST_NOTIFICATIONS)
    }
}
