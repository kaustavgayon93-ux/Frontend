import httpx
import json
import time
import os
import sys

print("[INFO] Starting ASSAC MRV Field Collect APK build job...", flush=True)

payload = {
    'packageId': 'in.gov.assam.assac.mrv',
    'name': 'ASSAC MRV Field Collect',
    'launcherName': 'MRV Field',
    'host': 'https://startup.assam.gov.in',
    'pwaUrl': 'https://startup.assam.gov.in/nesfic26/problem-statements/nesfic-d-15',
    'startUrl': '/nesfic26/problem-statements/nesfic-d-15',
    'webManifestUrl': 'https://raw.githubusercontent.com/kaustavgayon93-ux/Frontend/main/app/manifest.json',
    'iconUrl': 'https://raw.githubusercontent.com/kaustavgayon93-ux/Frontend/main/public/icon-512.png',
    'maskableIconUrl': 'https://raw.githubusercontent.com/kaustavgayon93-ux/Frontend/main/public/icon-512.png',
    'themeColor': '#166534',
    'themeColorDark': '#052e16',
    'backgroundColor': '#ffffff',
    'navigationColor': '#166534',
    'navigationColorDark': '#052e16',
    'navigationDividerColor': '#166534',
    'navigationDividerColorDark': '#052e16',
    'splashScreenFadeOutDuration': 300,
    'fallbackType': 'customtabs',
    'enableSiteSettingsShortcut': True,
    'enableNotifications': False,
    'includeSourceCode': True,
    'additionalTrustedOrigins': [],
    'display': 'standalone',
    'orientation': 'portrait',
    'appVersion': '1.0.0.0',
    'appVersionCode': 1,
    'signingMode': 'new',
    'signing': {
        'alias': 'assac-mrv',
        'fullName': 'Assam Forest Department',
        'organization': 'ASSAC',
        'organizationalUnit': 'Space Applications',
        'countryCode': 'IN',
        'keyPassword': 'AssamForest@2026',
        'storePassword': 'AssamForest@2026'
    },
    'features': {
        'locationDelegation': {'enabled': True}
    }
}

try:
    with httpx.Client(timeout=30.0) as client:
        print("[INFO] Enqueueing job to PWABuilder Cloud APK service...", flush=True)
        r = client.post(
            'https://pwabuilder-cloudapk.azurewebsites.net/enqueuePackageJob',
            json=payload,
            headers={'content-type': 'application/json', 'platform-identifier': 'ServerUI'}
        )
        print(f"[INFO] Response status: {r.status_code}", flush=True)
        if r.status_code != 200:
            print(f"[ERROR] Failed to enqueue: {r.text}", flush=True)
            sys.exit(1)
            
        job_id = r.text.strip()
        print(f"[OK] Job Enqueued: {job_id}", flush=True)
        print("[INFO] Polling job build progress...", flush=True)

        for i in range(30):
            time.sleep(3)
            jr = client.get(f'https://pwabuilder-cloudapk.azurewebsites.net/getPackageJob?id={job_id}')
            jdata = jr.json()
            status = jdata.get('status')
            logs = jdata.get('logs', [])
            print(f"  Attempt {i+1}: Status = {status} (logs={len(logs)})", flush=True)
            if logs:
                print(f"    Latest: {logs[-1]}", flush=True)

            if status == 'Completed':
                print("[SUCCESS] Build Completed! Downloading zip...", flush=True)
                zr = client.get(f'https://pwabuilder-cloudapk.azurewebsites.net/downloadPackageZip?id={job_id}', timeout=90)
                if zr.status_code == 200:
                    out_zip = 'ASSAC-MRV-Field-Collect.zip'
                    with open(out_zip, 'wb') as f:
                        f.write(zr.content)
                    print(f"[SUCCESS] Downloaded {out_zip} ({len(zr.content)} bytes)", flush=True)
                else:
                    print(f"[ERROR] Download failed with status {zr.status_code}", flush=True)
                break
            elif status == 'Failed':
                print("[ERROR] Job failed. Full logs:", flush=True)
                for log in logs:
                    print(f"  {log}", flush=True)
                break
except Exception as e:
    print(f"[FATAL] Exception: {e}", flush=True)
