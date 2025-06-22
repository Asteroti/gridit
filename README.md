## Gridit! 🐸

This app lets you upload an image and creates a rectilinear grid on top.

I created this for the people at my painting class.

Grids on top of images are used to help us scale the image into bigger canvases and get more precise drawings.

Ie
https://gurneyjourney.blogspot.com/2009/11/scaling-up-with-grid.html
https://www.gadsbys.co.uk/drawing-scaling-up-an-image-using-a-grid/

It's a really old method that still lives!
![image](https://github.com/user-attachments/assets/d93affdb-86c7-4fe3-a9f7-e58ebafdf298)
![image](https://github.com/user-attachments/assets/beaa1448-b097-43e9-a804-3ec25233f582)


#### The app looks like this for now:

![Screenshot 2025-05-05 at 12 44 24 AM](https://github.com/user-attachments/assets/f0f51ce6-09ed-4b75-b014-73e7826fd0db)

Check the Project to see current tasks in progress! More coming soon!

## Multilingual Support

Gridit now supports multiple languages! Users can switch between languages using the dropdown menu in the top-right corner of the application.

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

### Adding New Languages

To add a new language to Gridit:

1. Open `src/I18n.elm`
2. Add your new language to the `Language` type
3. Create a translation function for your language (follow the pattern of existing translations)
4. Add your language to the `translations` function
5. Update the language selector in `src/Main.elm` to include your new language

Each translation function maps translation keys to localized strings. Make sure to translate all keys to maintain a consistent user experience across languages.
