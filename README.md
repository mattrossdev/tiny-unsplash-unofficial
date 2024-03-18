# Unsplash Unofficial TinyMCE Plugin

This is an unofficial Unsplash plugin for the TinyMCE editor that allows you to search images using the Unsplash API and add them to the text editor.

## Setup

### Creating the Plugin File

To add this plugin to your TinyMCE editor, clone the repo and run `npm build` to create the dist folder. On the pages you're using the plugin, add the `/dist/plugin.min.js` file.

### Initializing the Editor

You can initialize the editor with this plugin like this:

```
tinymce.init({
  selector: "textarea.tinymce",
  plugins: "code image unsplash-unofficial",
  toolbar: "unsplash-unofficial",
  setup: (editor) => {
    editor.options.register("imageSearchURL", {
      processor: "string",
      default: YOUR_IMAGE_URL_HERE,
    });
  },
});
```

If this is for personal/internal use, the image URL should be "https://api.unsplash.com/search/photos?client_id={{YOUR_CLIENT_ID}}".

For external use you must pass the request through a server/proxy to avoid exposing your Unsplash API credentials. This is required by the [Unsplash API terms of use](https://unsplash.com/api-terms). In that case the image URL would be your server endpoint, which should return the same data you get from the Unsplash request.
