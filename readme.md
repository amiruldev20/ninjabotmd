# NINJABOT MD BETA
## Base example bot whatsapp multi device library baileys
### BASE DALAM PROSES PERBAIKAN, APABILA BUTUH BANTUAN WA SAYA => [![MY WHATSAPP](https://img.shields.io/badge/WA-ME.svg)](https://wa.me/687852104) 

!! ALL FUNCTION ADA PADA SYSTEM/CLIENT.TS, APABILA TIDAK FAHAM CARA PENGGUNAAN, SILAHKAN WA SAYA DIATAS

### remake? silahkan asalkan cantumkan sumber :)
<a href="https://visitor-badge.glitch.me/badge?page_id=amiruldev20/ninjabotmd"><img title="Visitor" src="https://visitor-badge.glitch.me/badge?page_id=amiruldev20/ninjabotmd"></a>
<a href="https://github.com/amiruldev20/ninjabotmd/network/members"><img title="Forks" src="https://img.shields.io/github/forks/amiruldev20/ninjabotmd?label=Forks&color=blue&style=flat-square"></a>
<a href="https://github.com/amiruldev20/ninjabotmd/watchers"><img title="Watchers" src="https://img.shields.io/github/watchers/amiruldev20/ninjabotmd?label=Watchers&color=green&style=flat-square"></a>
<a href="https://github.com/amiruldev20/ninjabotmd/stargazers"><img title="Stars" src="https://img.shields.io/github/stars/amiruldev20/ninjabotmd?label=Stars&color=yellow&style=flat-square"></a>
<a href="https://github.com/amiruldev20/ninjabotmd/graphs/contributors"><img title="Contributors" src="https://img.shields.io/github/contributors/amiruldev20/ninjabotmd?label=Contributors&color=blue&style=flat-square"></a>
<a href="https://github.com/amiruldev20/ninjabotmd/issues"><img title="Issues" src="https://img.shields.io/github/issues/amiruldev20/ninjabotmd?label=Issues&color=success&style=flat-square"></a>
<a href="https://github.com/Fokusdotid/bersama/issues?q=is%3Aissue+is%3Aclosed"><img title="Issues" src="https://img.shields.io/github/issues-closed/Fokusdotid/bersama?label=Issues&color=red&style=flat-square"></a>
<a href="https://github.com/Fokusdotid/bersama/pulls"><img title="Pull Request" src="https://img.shields.io/github/issues-pr/Fokusdotid/bersama?label=PullRequest&color=success&style=flat-square"></a>
<a href="https://github.com/Fokusdotid/bersama/pulls?q=is%3Apr+is%3Aclosed"><img title="Pull Request" src="https://img.shields.io/github/issues-pr-closed/Fokusdotid/bersama?label=PullRequest&color=red&style=flat-square"></a>


[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/amiruldev20/ninjabotmd)
## Join Group Diskusi
[![BOT DISCUSSION GROUP](https://img.shields.io/badge/WhatsApp%20Group-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/EDfrTs6MhuRLT0kIdpb848) 
**NO BOT**

## BAHAN² DAN KONFIGURASINYA

* Download NODEJS [`Klik Disini`](https://nodejs.org/en/download/)
* Download GIT [`Klik Disini`](https://git-scm.com/downloads)
* Download FFMPEG [`Klik disini`](https://filetransfer.io/data-package/M01DGQhS#link)
 - add env (rdp) C:/ffmpeg/bin
 - add env (rdp) C:/Windows/System32
* Download Imagemagick [`Klik Disini`](https://imagemagick.org/script/download.php)

## INSTALASI DI VPS & RDP

```bash
git clone https://github.com/amiruldev20/ninjabotmd

cd ninjabotmd

npm i


-- jika ts-node dan nodemon tidak terinstall, silahkan install manual dengan command dibawah
npm i -g ts-node
npm i -g nodemon
```
* perintah jalankan: npm run dev
* ingin session lain? npm run dev . namasession
---------

## INSTALASI DI PANEL PTERODACTYL
```bash
silahkan beli akun panel pterodactyl ke orang atau bisa minta ke saya, chat whatsapp diatas

++ CONFIGURASI ++
1. silahkan suruh penjual untuk membuatkan server dengan egg nodes
2. suruh penjual untuk mencustom startup server anda seperti dibawah ini
if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/npm run dev

3. login ke akun anda
4. klik server dan pergi ke startup
5. git repo address silahkan isi dengan https://github.com/amiruldev20/ninjabotmd
6. install branch isi dengan main
7. bot js file isi index.js
8. git username isi dengan username githubmu
9. git access token isi dengan token githubmu
10. pergi ke console dan klik start

#NB: jika tidak bisa git clone silahkan pergi ke settings dan klik reinstall server
```

## CEK LIST FUNCTION
```
silahkan command di bot seperti dibawah, untuk semua setting ada di database/settings.json
=> Object.keys(client) = cek list client yg ada di client.ts
=> Object.keys(util) = cek list func yg ada di util.ts
=> Object.keys(database) = cek list database
=> Object.keys(global) = cek global

=> opts.read = true (untuk mengaktifkan auto read)
=> opts.self = true (self mode)
=> opts.nyimak = true (nyimak mode)
=> opts.call = true (anti call)

eval bot => renz
```

## UNTUK PENGGUNA TERMUX

* Download Termux [`Klik Disini`](https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_universal.apk)

```
comingsoon
```
---------
## UNTUK PENGGUNA HEROKU

### Instal Buildpack
* heroku/nodejs
* https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
* https://github.com/mcollina/heroku-buildpack-imagemagick.git

---------

##### Special Thanks to
[![Adiwajshing](https://github.com/adiwajshing.png?size=100)](https://github.com/adiwajshing)
[![BochilGaming](https://github.com/BochilGaming.png?size=100)](https://github.com/BochilGaming)

###### Contributor
[![Amirul Dev](https://github.com/amiruldev20.png?size=100)](https://github.com/amiruldev20)
[![Amelia Lisa](https://github.com/Ameliascrf.png?size=100)](https://github.com/Ameliascrf)
[![Maykell](https://github.com/MAYKELL07.png?size=100)](https://github.com/MAYKELL07)
