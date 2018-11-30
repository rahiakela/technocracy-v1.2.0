# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

#############################Docker Manual####################################

###Building Docker image

docker build -t <tag_name> .<current_directory> -f <Dockerfile_Name>

docker build . -t technocracy:technocracy-server-1.0.0.0 -f Dockerfile

###Tagging Docker image with Docker Hub repository

docker tag <image_name> docker.io/<user_id>/<repository_name>:<tag_name>

docker tag technocracy:technocracy-server-1.0.0.0 docker.io/rahiakela/technocracy:technocracy-server-1.0.0.0

###Pushing Docker image into Docker Hub repository

docker push docker.io/<user_id>/<repository_name>:<tag_name>

docker push docker.io/rahiakela/technocracy:technocracy-server-1.0.0.0

###Pulling Docker image from Docker Hub repository

docker pull docker.io/<user_id>/<repository_name>:<tag_name>

docker pull docker.io/rahiakela/technocracy:technocracy-server-1.0.0.0

###Running Docker container from image

docker run -d -p 3000:3000 rahiakela/technocracy:technocracy-server-1.0.0.0

###Stoping Docker container

docker ps

docker stop <container_id>

###########################Git Manual################################

create a new repository on the command line

###Mark working directory as a git repo

git init

###Add all files from current directory into repo to commit

git add .

###Commit all changes from current directory into repo

git commit -m "first commit"

###Link remote github repo

git remote add origin https://github.com/rahiakela/docker-library.git

###Push local repo into github repo

git push -u origin master

push an existing repository from the command line

Run git remote add origin https://github.com/rahiakela/docker-library.git command if you are not connected to Github repo. Otherwise run git push -u origin master command
