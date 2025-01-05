import React, { useEffect, useState } from "react";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

export const KeepScreenAwake = () => {
  const [isWakeLockSupported, setIsWakeLockSupported] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    if ("wakeLock" in navigator) setIsWakeLockSupported(true);
  }, []);

  const toggleWakeLock = async () => {
    if (wakeLock) {
      // Release the wake lock if it's active
      await wakeLock.release();
      setWakeLock(null);
    } else {
      // Request the wake lock if it's not active
      if (navigator.wakeLock) {
        try {
          const lock = await navigator.wakeLock.request("screen");
          setWakeLock(lock);
          lock.addEventListener("release", () => {
            setWakeLock(null);
          });
        } catch (err) {
          console.error("Failed to acquire wake lock:", err);
        }
      }
    }
  };

  console.log(wakeLock);

  return (
    <div>
      {isWakeLockSupported && (
        <div className="flex items-center gap-2">
          <Label htmlFor="wakelock">Keep screen awake</Label>
          <Switch
            id="wakelock"
            checked={!!wakeLock}
            onCheckedChange={toggleWakeLock}
          />
        </div>
      )}
    </div>
  );
};
