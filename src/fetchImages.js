/* 
fetching images
 */

export async function fetchImages(searchedImages, page) {
  const response = await fetch(
    `https://pixabay.com/api/?key=32715422-e0410e3c137bf18af69487d41&q=${searchedImages}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  const images = await response.json();
  return images;
}
