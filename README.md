# selfcheck

A badly implemented front end to cron.  
Used as a front end to my alarm clock runing off a [raspberry pi](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/).

#### Installing
 1. `git clone https://github.com/ojourmel/selfcheck.git <HTTP_ROOT>`
 2. [`http://localhost`](http://localhost)

Selfcheck should work in any subfolder of your webserver.

#### Dependencies
 * PHP
 * [cron](https://wiki.gentoo.org/wiki/Cron)
 * Javascript enabled browser
 * Internet access for CDN dependencies
    - [Semantic-UI](http://semantic-ui.com/)
    - [jQuery](http://jquery.com/)
    - [jquery-timepicker](https://jonthornton.github.io/jquery-timepicker/)

#### Hacking
 * CDN libraries can be downloaded localy and sourced in `index.html` to remove Internet access requirement.
 * JS code is located in `/js`
 * PHP code is located in `/php`

#### Limitations
 * The backend stores individual items as 'checks'. This is done using flat text files that are index in an array using their file name. As a result, removing, or reordering these 'checks' is non-trivial. This is a huge pain point. As a result, reordering items is not supported, and deleting items causes backend refreshes of cron.
 * This implementation assumes the `http` user (or whatever user the php code is executed as) has access to a `crontab`, **and** that the `crontab` is not used by **anything** else. This `crontab` is freqenetly blown away as items are added and removed.
 * Mobile support is not great.
 * 

#### [License](https://github.com/ojourmel/selfcheck/blob/master/LICENSE)
 * 3-Clause BSD
