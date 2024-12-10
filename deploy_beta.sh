# build & update
npm run build:beta

scp -i ~/.ssh/bon_java -r ./build/*  ubuntu@3.16.246.52:/home/ubuntu/app/tokrio/
