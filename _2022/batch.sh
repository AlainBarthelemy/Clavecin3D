#!/bin/bash

# wait
sleep 5

# never blank out the screen
xset s noblank
xset s off
xset -dpms

# hide mouse
unclutter -idle 0 -root &

# START CHROMIUM KIOSK (re-launch on quit)
rm ~/snap/chromium/common/chromium/Singleton*
chromium-browser \
  --no-first-run \
  --start-maximized \
  --window-position=0,0 \
  --window-size=1920,1080 \
  --disable \
  --disable-translate \
  --disable-infobars \
  --disable-suggestions-service \
  --disable-save-password-bubble \
  --disable-session-crashed-bubble \
  --incognito \
  --noerrdialogs \
  --kiosk "http://localhost"
