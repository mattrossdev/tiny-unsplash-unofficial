export const fetchImages = (
  search: string,
  orientation: string,
  unsplash_api_key: string
) => {
  let url = `https://api.unsplash.com/search/photos?page=1&query=${search}
&client_id=${unsplash_api_key}&per_page=10`;

  if (orientation == "portrait" || orientation == "landscape") {
    url += `&orientation=${orientation}`;
  }

  console.log(url);

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        resolve(data.results);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
