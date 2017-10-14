#!/bin/bash

mkdir smapi/videos
for video in '/news 1034_20171013170000' \
## '/media/rhonyc rhonyc_801' \
## '/news 1034_20171013170000' \
## '/media/sprout YSHR01012H' \

do
./smapi/downloadmp4.sh $video
echo $video
done
