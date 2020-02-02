#Goal : docker-compose of server with dist file cd built

#step 1 : build dist file

#step 1.1 : save assets from precedent dist file in a tmp directory

rm -rf tmp_assets/

mkdir tmp_assets

cp -R server-Project-Manager/dist/front-Project-Manager/assets/ tmp_assets/

#step 1.2 : generate the dist file

cd front-Project-Manager

npm run extract

#step 1.3 : replace the precedent dist file of server-Project-Manger by the new one

rm -rf ./../server-Project-Manager/dist

mkdir ../server-Project-Manager/dist  

cp -r ./dist ./../server-Project-Manager

cd ..

# step 1.4 : add the precedent assets to the new one

cp -R tmp_assets/ server-Project-Manager/dist/front-Project-Manager/assets/


#step 2 : Run docker-compose

cd server-Project-Manager

docker-compose up
