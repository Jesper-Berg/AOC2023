#!/bin/sh

dayDir="day$1"
echo $dayDir
mkdir $dayDir
touch $dayDir/input.txt
touch $dayDir/testinput.txt
cp solution.ts $dayDir