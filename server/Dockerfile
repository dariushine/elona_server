FROM node:alpine

RUN mkdir /src/app -p

RUN npm install -g nodemon

# Define working directory
WORKDIR /src/app
ADD . /src/app
RUN npm install

# Expose port
EXPOSE  80

# Run app
CMD ["node", "/src/app/app.js"]