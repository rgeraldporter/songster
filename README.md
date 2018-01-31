# Songster
#### v0.6.0
[![Build Status](https://travis-ci.org/rgeraldporter/songster.svg?branch=master)](https://travis-ci.org/rgeraldporter/songster)

Birdsong playback module written in Node.js intended for use as part of a playback machine using a lightweight single-board computer such as a Raspberry Pi.

This is a work in progress. API is not set in stone yet.

#### Additional setup for Raspberry Pi

For the Raspberry Pi this uses the onboard audio, which out of the box needs some setup. I used a Raspberry Pi 3.

You'll need `mpg321`:

```
sudo apt-get install mpg321
```

If developing on MacOS, you can install `mpg321` with Homebrew:

```
brew install mpg321
```

And to get audio that isn't hissy with a lot of static, you'll want to update with this new audio driver [discussed here](https://www.raspberrypi.org/forums/viewtopic.php?f=29&t=136445).

In `/boot/config.txt` add the following, then reboot:
```
audio_pwm_mode=2
```

## License

The MIT License (MIT)

Copyright (c) 2017-2018 Robert Gerald Porter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
