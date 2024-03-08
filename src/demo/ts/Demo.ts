import { TinyMCE } from "tinymce";

import Plugin from "../../main/ts/Plugin";

import { unsplash_api_key } from "../../config";

declare let tinymce: TinyMCE;

Plugin();

tinymce.init({
  selector: "textarea.tinymce",
  plugins: "code image unsplash-unofficial",
  toolbar: "unsplash-unofficial",
  setup: (editor) => {
    editor.options.register("unsplash_api_key", {
      processor: "string",
      default: unsplash_api_key,
    });
  },
});
