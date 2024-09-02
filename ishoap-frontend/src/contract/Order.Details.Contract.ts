interface User {
    _id: string;
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
    password: string;
    addresses: string[]; // Array of address IDs
    mobile: string;
    gender: string;
    dateOfBirth: string; // Use 'Date' if you want to manipulate dates
    __v: number;
  }
  
  interface Product {
    productId: {
      rating: {
        rate: number;
        count: number;
      };
      _id: string;
      name: string;
      price: number;
      description: string;
      stock: number;
      image: string[];
      vendorId: string;
      categoryId: string;
      ratingsDetails: string[];
      __v: number;
    };
    quantity: number;
    _id: string;
  }
  
  interface Address {
    _id: string;
    customerId: string;
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    mobile: string;
    __v: number;
  }
  
 export default interface Order {
    _id: string;
    userId: User;
    products: Product[];
    totalPrice: number;
    AddressId: Address;
    paymentStatus: string;
    createdAt: Date; 
    updatedAt: Date; 
    __v: number;
    PaymentId: string;
  }
  