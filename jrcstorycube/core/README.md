# NewsCube
The NewsCube is an interactive, 3D storytelling tool that uses a cube to show multiple perspectives on a complex issue. 
The sides of a NewsCube can be used to hold original or aggregated content in the form of text, images, sounds, vision or documents.

### Usage
Use the code to create a virtual cube, make it rotaate and add content to it. 

### Contribute
We welcome contributions via Pull Requests. We are keen to improve the NewsCube so please contribute. 
We'd also love to hear if you have jsut used our code in your own projects. Send us links so we can see your work :)

## Licence
The NewsCube is released under the Mozilla Public Licence v2.0. 
This software was made possible using [ThreeJS](http://threejs.org) by mrdoob, licenced under the MIT licence.

## Simple JavaScript integration
To add a NewsCube to your project, you should follow three simple steps:

### Include the NewsCube JavaScript core files
```
<script type="text/javascript" src="newscube/core/dependencies/threejs/3d.min.js"></script>
<script type="text/javascript" src="newscube/core/dependencies/threejs/OrbitControls.js"></script>
<script type="text/javascript" src="newscube/core/cube.js"></script>
```

### Create a NewsCube container
```
<div id="newscube"></div>
```

### Make it spin
```
var faces = ['faces/front.html', 
			 'faces/right.html', 
			 'faces/back.html', 
			 'faces/left.html', 
			 'faces/bottom.html', 
			 'faces/top.html'];

var callback = function(f) {
	console.log(f);
}

var newsCube = new NewsCube('newscube', callback, faces);

newsCube.start();
```

### Advanced guide

Find out more about what you can do with the [NewsCube API](ADVANCED.md) 

# Find out more
To try our implementation of the NewsCube, head to: http://newscube.io
To find out more about the NewsCubed project head to our website: website: http://newscubed.com

### Credits
The NewsCube was created by [Skye Doherty](http://skyedoherty.com), developed by [Andrea Epifani] (http://andreaepifani.com), and made beautiful by [David Lloyd] (http://www.dld.net.au)

### Contact
Email: cube@newscubed.com





