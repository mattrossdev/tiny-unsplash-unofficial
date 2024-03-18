export const fetchImages = (
  search: string,
  orientation: string,
  page: number,
  per_page: number,
  imageSearchURL: string
): Promise<Record<string, unknown>> => {
  const url = new URL(imageSearchURL);
  const params = url.searchParams;
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
        console.error("An error occured: ", error);
        reject(error);
      });
  });
};
