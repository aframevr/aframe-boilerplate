#!/bin/bash

mkdir smapi/videos
for video in '/media/sprout YSHR01012H' \
'/media/rhonyc rhonyc_801' \
'/news 1034_20171013170000' \

do
./shell/downloadmp4.sh $video
echo $video
done
