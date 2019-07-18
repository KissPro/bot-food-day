$ heroku login
$ heroku git:clone -a <your app name>
$ cd <your app name>
Once you have this set up, you can update your app with changes from this repository with the following:

$ git remote add slack-meme https://github.com/nicolewhite/slack-meme
$ git pull slack-meme master
$ git push heroku master
