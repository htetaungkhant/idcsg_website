export interface Doctor {
  id: string;
  name: string;
  degree: string;
  about: string;
  image: {
    id: string;
    image: string;
    thumbnail: string;
  };
}
