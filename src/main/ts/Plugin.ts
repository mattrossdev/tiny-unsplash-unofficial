import { Editor, TinyMCE } from "tinymce";

import { fetchImages } from "./core/Fetch";
import { waitForElement } from "./core/WaitForElement";

declare const tinymce: TinyMCE;

const setup = (editor: Editor): void => {
  const imageSearchURL = tinymce.activeEditor.options.get("imageSearchURL");

  const handleImageClick = (src) => {
    tinymce.activeEditor.windowManager.close();
    tinymce.activeEditor.execCommand("mceImage");

    //TODO: Find a better way of targeting this element
    //This would be ideal if implemented: https://github.com/tinymce/tinymce/issues/2832
    waitForElement('input[type="url"].tox-textfield').then((urlInput) => {
      const urlInputElement = urlInput as HTMLInputElement;
      let regular_img_src = src;
      regular_img_src = regular_img_src.replace("&w=400", "&w=1080");
      urlInputElement.value = regular_img_src;
    });
  };

  (window as any).handleImageClick = handleImageClick;

  const openImageDialog = (imageData) => {
    const generateImageHTML = (image) => {
      const src = image.urls.small;
      const user = image.user.username;
      const profile = image.user.links.html;
      let imageHTML = `<div style="display: flex; flex-direction: column; align-items: center;">`;
      imageHTML += `<span> <img src="${src}" class="unsplash-search-img" style = "max-width: 80%; cursor: pointer;" onClick="handleImageClick(this.src)"; tabindex='0'> </span>`;
      imageHTML += `<span style = "margin-top: 5px"> Photo by <a href = ${profile}>@${user} </a> </span>`;
      imageHTML += `</div>`;
      return imageHTML;
    };

    const generateImageGridHTML = () => {
      let imageGridHTML = "";
      imageGridHTML += `<div style = "display: grid; grid-template-columns: 1fr 1fr;">`;
      for (let i = 0; i < imageData.length; i++) {
        imageGridHTML += generateImageHTML(imageData[i]);
      }
      imageGridHTML += "</div>";
      return imageGridHTML;
    };

    const imageGridHTML = generateImageGridHTML();

    return editor.windowManager.open({
      title: "Results via Unsplash",
      body: {
        type: "panel",
        items: [
          {
            type: "input",
            name: "search",
            label: "Search",
          },
          {
            type: "selectbox",
            name: "orientation",
            label: "Orientation",
            size: 1,
            items: [
              { value: "all", text: "All" },
              { value: "landscape", text: "Landscape" },
              { value: "portrait", text: "Portrait" },
            ],
          },
          {
            type: "htmlpanel",
            html: imageGridHTML,
          },
        ],
      },
      buttons: [
        {
          type: "cancel",
          text: "Close",
        },
        {
          type: "submit",
          text: "Search",
          primary: true,
        },
      ],
      onSubmit: (api) => {
        const search = api.getData().search;
        const orientation = api.getData().orientation;
        api.close();
        fetchImages(search, orientation, 1, 10, imageSearchURL)
          .then((imageData) => {
            api.close();
            openImageDialog(imageData);
          })
          .catch((error) => {
            console.error("An error occured: ", error);
          });
      },
    });
  };

  const openSearchDialog = function () {
    return editor.windowManager.open({
      title: "Search Unsplash",
      body: {
        type: "panel",
        items: [
          {
            type: "input",
            name: "search",
            label: "Search",
          },
          {
            type: "selectbox",
            name: "orientation",
            label: "Orientation",
            size: 1,
            items: [
              { value: "all", text: "All" },
              { value: "landscape", text: "Landscape" },
              { value: "portrait", text: "Portrait" },
            ],
          },
        ],
      },
      buttons: [
        {
          type: "cancel",
          text: "Close",
        },
        {
          type: "submit",
          text: "Search",
          primary: true,
        },
      ],
      onSubmit: (api) => {
        const search = api.getData().search;
        const orientation = api.getData().orientation;
        fetchImages(search, orientation, 1, 10, imageSearchURL)
          .then((imageData) => {
            api.close();
            openImageDialog(imageData);
          })
          .catch((error) => {
            console.error("An error occured: ", error);
          });
      },
    });
  };

  editor.ui.registry.addButton("unsplash-unofficial", {
    text: "Unsplash",
    onAction: () => {
      openSearchDialog();
    },
  });
};

export default (): void => {
  tinymce.PluginManager.add("unsplash-unofficial", setup);
};
