## Gridit! 🐸

# [www.gridit.baby](https://www.gridit.baby)

It's live! (¯▿¯)

This app lets you upload an image and creates a rectilinear grid on top.

I created this for the people at my painting class, I hope you can use it too!

### Huh? What is this?

Grids on top of images are used to help us scale the image into bigger canvases and get more precise drawings.

Ie:

https://gurneyjourney.blogspot.com/2009/11/scaling-up-with-grid.html
https://www.gadsbys.co.uk/drawing-scaling-up-an-image-using-a-grid/

It's a really old method that still lives!

![image](https://github.com/user-attachments/assets/d93affdb-86c7-4fe3-a9f7-e58ebafdf298)



## How to Use Gridit

### Hello fellow artists ♡＼(￣▽￣)／♡

1. **Upload an Image**: Click the "Upload Image" button to select an image from your device.

2. **Customize the Grid**: Use the sliders to adjust:
   - Grid Size: Controls the number of rectangles in the grid (2-50)
   - Grid Color: Choose a color that contrasts well with your image
   - Grid Thickness: Adjust the line thickness for better visibility
   - Grid Opacity: Make the grid more or less transparent

3. **View the Result**: Your image with the grid overlay will appear in the "Gridded Image" preview window.

4. **Download**: Click the "Download your Gridded Image!!!" button to save the gridded image to your device.

5. **Use for Scaling**: Print the gridded image and use it as a reference to scale up your drawing onto a larger canvas by recreating the grid and transferring the image square by square.


## Running Locally (⌐■_■)

If you're a cool developer interested in running Gridit locally or contributing to the project, follow these steps:

1. **Clone the Repository**

2. **Serve the Application**:
   Gridit is written in elm!
   ```bash
   # cd into the containing folder
   elm reactor
   ```
3. **Access the Application**:
   Open `http://localhost:8000`

### Development

Gridit is built with Elm and uses vanilla JavaScript for canvas manipulation:

- The Elm code is in `public/src/Main.elm` and `public/src/I18n.elm`
- The JavaScript interop is in `public/src/grid-merge.js`
- To compile the Elm code after making changes:
  ```bash
  elm make public/src/Main.elm --output=public/index.html
  ```

## Multilingual Support

Gridit now supports multiple languages! Users can switch between languages using the dropdown menu in the top-right corner of the app.

### Currently Supported Languages

- English
- Spanish (Español)
- Latin
- Italian (Italiano)
- Portuguese (Português)
- French (Français)
- Asturiano (Asturianu)
- Gaelic (Gàidhlig)
- Euskara
- Japanese (日本語)
- Russian
- Tuvan
- Amharic
- Hebrew (עברית)

### Adding New Languages

To add a new language to Gridit:

1. Open `src/I18n.elm`
2. Add your new language to the `Language` type
3. Create a translation function for your language (follow the pattern of existing translations)
4. Add your language to the `translations` function
5. Update the language selector in `src/Main.elm` to include your new language

Each translation function maps translation keys to localized strings. Make sure to translate all keys to maintain a consistent user experience across languages.
