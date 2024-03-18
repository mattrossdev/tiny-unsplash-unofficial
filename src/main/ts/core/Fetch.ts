export const fetchImages = (
  search: string,
  orientation: string,
  page: Number,
  per_page: Number,
  imageSearchURL: string
): any => {
  let url = new URL(imageSearchURL);
  let params = url.searchParams;
  params.append("query", search);
  params.append("page", page.toString());
  params.append("per_page", per_page.toString());

  url.search = params.toString();

  if (orientation == "portrait" || orientation == "landscape") {
    params.append("orientation", orientation);
  }

  return new Promise((resolve, reject) => {
    fetch(url.href)
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
