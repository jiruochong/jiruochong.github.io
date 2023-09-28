## NewsCube integration - Advanced
The NewsCube API includes a lot of feature to control the content and the animation of your NewsCube. This guide is an overview of all the available features, we will accept all community suggestions and contributions so feel free to Push your changes! :)

### Faces content
The NewsCube faces can be filled with any content that can be rendered in a 'normal' HTML5 page. So, text, images, video and audio are all elements that can be placed on the sides of a cube. You can even fill faces with PDF files! All you need to do is specify links to the content you wish to render when you create your cube.

This, for example, will create a cube with two local files, two external websites and two local PDF files:

```
var faces = ['faces/front.html', 
			 'https://google.com', 
			 'faces/back.html', 
			 'https://newscubed.com', 
			 'faces/file1.pdf', 
			 'faces/file2.pdf'];

var callback = function(f) {
	console.log(f);
}

var newsCube = new NewsCube('newscube', callback, faces);

newsCube.start();
```