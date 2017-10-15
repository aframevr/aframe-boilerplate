#!/bin/bash

## http://174.129.13.43/news/1034_20171013170000.mp4
## http://174.129.13.43/<maddress>/<assetid>.mp4
## http://174.129.13.43/media/sprout/YSHR01012H.mp4

curl http://174.129.13.43$1/$2.mp4 > smapi/videos/$2.mp4
