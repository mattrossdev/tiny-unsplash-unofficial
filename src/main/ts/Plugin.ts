import { Editor, TinyMCE } from "tinymce";

import { fetchImages } from "./core/Fetch";

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  const unsplash_api_key = tinymce.activeEditor.options.get("unsplash_api_key");

  const handleImageClick = (src) => {
    console.log("going to close");
    tinymce.activeEditor.windowManager.close();
    console.log("should be closed now");
    tinymce.activeEditor.execCommand("mceImage");
    console.log("image uploader should be here");

    /* The modal field is not immediately visible. 
  It will fail to find the element without a timeout (hacky solution) */
    setTimeout(function () {
      //This is subject to change/not an ideal selector
      //TODO: Find a better way of targeting this
      const urlInput: any = document.querySelector(
        'input[type="url"].tox-textfield'
      );

      if (urlInput) {
        let regular_img_src = src;
        regular_img_src = regular_img_src.replace("&w=400", "&w=1080");
        urlInput.value = regular_img_src;
      } else {
      }
    }, 50);
  };

  /* Click event listener doesn't work. 
  If you use click and are focused into a text field that's out of view,
  the callback doesn't happen */
  document.addEventListener("mousedown", (event: any) => {
    console.log("click");
    console.log(event.target.classList);
    if (event.target.classList.contains("unsplash-search-img")) {
      console.log("should respond to click");
      handleImageClick(event.target.src);
    }
  });

  const openImageDialog = (imageData) => {
    const generateImageHTML = (image) => {
      const src = image.urls.small;
      const user = image.user.username;
      const profile = image.user.links.html;
      let imageHTML = `<div style="display: flex; flex-direction: column; align-items: center;">`;
      imageHTML += `<span> <img src="${src}" class=unsplash-search-img style = "max-width: 80%; cursor: pointer;">`;
      imageHTML += `<span style = "margin-top: 5px"> Photo by <a href = ${profile}>@${user} </a> </span>`;
      imageHTML += `</div>`;
      return imageHTML;
    };

    const generateImageGridHTML = () => {
      let imageGridHTML = "";
      imageGridHTML += `<div style = "display: grid; grid-template-columns: 1fr 1fr ">`;
      //imageGridHTML += "";
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
        fetchImages(search, orientation, unsplash_api_key)
          .then((imageData) => {
            api.close();
            openImageDialog(imageData);
          })
          .catch((error) => {});
      },
    });
  };

  var openSearchDialog = function () {
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
        fetchImages(search, orientation, unsplash_api_key)
          .then((imageData) => {
            api.close();
            openImageDialog(imageData);
            console.log(imageData);
          })
          .catch((error) => {});
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
