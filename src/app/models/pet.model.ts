export interface Category {
    id?: number;
    name: string;
  }
  
  export interface Tag {
    id?: number;
    name: string;
  }
  
  export type PetStatus = 'available' | 'pending' | 'sold';
  
  export interface Pet {
    id?: any;
    category?: Category;
    name: string;
    photoUrls: string[];
    tags?: Tag[];
    status: PetStatus;
  }