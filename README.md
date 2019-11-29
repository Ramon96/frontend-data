[![Netlify Status](https://api.netlify.com/api/v1/badges/6ec24ec8-1e0a-4c88-8eb9-873527bf4572/deploy-status)](https://app.netlify.com/sites/maskers-fd/deploys)

# Frontend Data
![Maskers op functie over de hele wereld](https://github.com/Ramon96/frontend-data/blob/master/documantion/demo.gif)

# Concept
This is an iteration of my previous concept of functional-programming. During that project I made an static map that shows the locations of mask with functions. During this project I plan on adding interaction in a way that people intrested in the data are able to analyze it and find intresting pattern's.

# Description
During this course I created a data visualisation with the help of D3, I worked on this project locally and builded with the use of Parcel. During this project Data of the NMVW was used.
This project is made with [D3](https://d3js.org/)

# Target Audience
This visualisation was build in mind for someone to find pattern's in the data. This could easily be replaced with another subject to get a better understanding of the collection. This would benefit someone like Rik. This Visualisation might be intresting for museum visitors now that there is some interaction added to the visualisation. 

# Installation
You want to clone this project to a local folder using the following code. 
`https://github.com/Ramon96/frontend-data.git`

**Build** 
This project makes use of the bundler called Parcel. Parcel compiles the code in one unreadable code that is minified and is supported by all browsers. In short it makes our life easier. 

When Developing make use of the command
`npm run dev` 
This will set you up with a live server

for building you could run 
`npm run build`
but this is not needed since netlify does this for us.

# .gitignore
This project uses node_modules other people don't need that and for that reason it is added to the git ignore. I don't need the build folder since im using netlify to build.
```
node_modules
dist
.cache
```

# Features
- [x] Zooming
- [x] Dragging
- [x] Hovering for tooltips
- [x] Filtering on category

# Known Bugs 
 * It might take a while for the map to load.
 * Able to drag out the map out of its view
 
# Upcomming features
- [ ] multiple selection filtering

# Things I have learned during these 2 weeks
 * Enter update exit pattern
 * Making fancy transition 
 * Using another visualisation to respond with another one
 
# Things I wish I had learned
 * Im actually very statisfy'd with what I've learned these 2 weeks!
 (Things I wish I did: Kept my code clean)
 
# wiki 
Please check out my [Wiki](https://github.com/Ramon96/frontend-data/wiki)

# Credits
 I would like to thank
 Laurens Arnoudse for hi's lecture's and amazing example's on his vizhub.
 Tomas Stolp for explaining D3 functions that where kind of tricky to my.
 Manouk Knappe for showing an solution for overlapping text.
 
 Please check out this page for more detailed credits.
 
# Data
 The data used in this project is data acuired from the NMVW database collection with the use of Sparql.
 I am getting the Mask by function. They also require to have a lat and long value. 
 For mor information about the Data check out [this]() wiki page.

# License
[MIT @ Ramon Meijers](https://github.com/Ramon96/frontend-data/blob/master/LICENSE)

