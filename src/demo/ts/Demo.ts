import { TinyMCE } from "tinymce";

import Plugin from "../../main/ts/Plugin";

import { image_search_url } from "../../config";

declare let tinymce: TinyMCE;

Plugin();

tinymce.init({
  selector: "textarea.tinymce",
  plugins: "code image unsplash-unofficial",
  toolbar: "unsplash-unofficial",
  setup: (editor) => {
    editor.options.register("imageSearchURL", {
      processor: "string",
      default: image_search_url,
    });
  },
});
