/*
right now i am facing an issue to rotate the image
we cannot the the cordinate of the image and rotate it just like we used to do with the polygon and outher coutome shape
so the only way we can rotate an image to use ctx.rotate but if we use this method then we are not going to be able to draw the frame 
and drag the image to the current position and we cannot click and display the frame

so one way to slove this is to make an array_of_frames which is going to contain all the frame of each image and we are going to drag the image with the help of the frame
and when someone is going to click insted of check in which image the mouse has been clicked we are going to chack for the frame where it have been clicked
and when the user want to drag the image , we are going to drag the frame and the image as well

and when we want to rotate the image we going to use ctx.rotate and rotate the image and going to store the angle
and at the same time we are going to rotate the  frame points of that respective image so when we want to click and show the frame we can so this easily

now one way to rotate the frame is to use ctx.rotate and another one is polygon method
but one more issue is where should i store the angle of the image/frame should i store that in my frame array or in image array

i also need to make some functionality

1. custome shape and store them
2. selection multiple shapes or images 
3. free-hand pen like drawing
4. grid 
5. pixelation and blur effect on the image
6. resize of every type of shape --> V.V.I
7. rotation of images --> V.V.I
8. selection of the right image
9. clipping of the images
10. animation popup using (gsap) or (framer motion)

*/