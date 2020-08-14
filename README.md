### How to run on Android device
- Enable Developer Options and USB debugging on your Android device. [Learn how][dev_options_tutorial]
- Connect Android device via USB
- Open Terminal and go to the root of `caresteps-client` project
- Install dependecies and run app
```sh
$ npm i
$ npm start
```
- It should run Expo process on `http://localhost:19002/`
- Click `Run on Android device/emulator` on the left side of the screen
- Wait few minutes for bundle to create and install on your device

[dev_options_tutorial]: <https://www.howtogeek.com/129728/how-to-access-the-developer-options-menu-and-enable-usb-debugging-on-android-4.2/>
