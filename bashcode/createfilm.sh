ffmpeg -f concat -safe 0 -i filmfiles.txt -c copy film$(date "+%s").mp4
