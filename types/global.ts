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

// Dental Technology Types
export interface DentalTechnology {
  id: string;
  imageUrl: string; // Main technology image (required)
  title: string; // Technology title (required)
  overview: string; // Technology overview (required)
  description?: string; // Detailed description (optional)
  section1?: DentalTechnologySection1;
  card1?: DentalTechnologyCard1;
  card2?: DentalTechnologyCard2;
  createdAt: Date;
  updatedAt: Date;
}

export interface DentalTechnologySection1 {
  id: string;
  dentalTechnologyId: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DentalTechnologyCard1 {
  id: string;
  dentalTechnologyId: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DentalTechnologyCard2 {
  id: string;
  dentalTechnologyId: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form data types for creating/editing dental technologies
export interface DentalTechnologyFormData {
  // Required fields
  mainImage?: File;
  title: string;
  overview: string;

  // Optional fields
  description?: string;

  // Section 1 fields
  section1Image?: File;
  section1Title?: string;
  section1Description?: string;

  // Card 1 fields
  card1Image?: File;
  card1Title?: string;
  card1Description?: string;

  // Card 2 fields
  card2Image?: File;
  card2Title?: string;
  card2Description?: string;
}

// API response types
export interface CreateTechnologyResponse {
  success: boolean;
  data?: DentalTechnology;
  error?: string;
}
