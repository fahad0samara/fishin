export const BASE_URL = "http://localhost:3000";

export const REGISTER_URL = `${BASE_URL}/auth/register`;
export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const LOGOUT_URL = `${BASE_URL}/auth/logout`;
export const FETCH_USER_URL = `${BASE_URL}/auth/me`;

export const ADD_TO_CART_URL = `${BASE_URL}/cart/add`;
export const FETCH_CART_URL = (userId: string) =>
  `${BASE_URL}/cart/cart/${userId}`;
export const REMOVE_ITEM_FROM_CART_URL = (userId: string, itemId: string) =>
  `${BASE_URL}/cart/delete/${userId}/${itemId}`;
export const CLEAR_CART_URL = (userId: string) =>
  `${BASE_URL}/cart/clear/${userId}`;
export const UPDATE_CART_ITEM_QUANTITY_URL = (userId: string, itemId: string) =>
  `${BASE_URL}/cart/updateQuantity/${userId}/${itemId}`; 
export const FETCH_CATEGORIES_URL = `${BASE_URL}/api/categories`;
export const ADD_MENU_URL = `${BASE_URL}/api/menu`;
export const FETCH_MENU_URL = `${BASE_URL}/api/menu/user`;
export const FETCH_MENU_BY_CATEGORY_URL = (categoryId: string) =>
  `${BASE_URL}/api/menu/${categoryId}`;

export const FETCH_USERS_URL = (currentPage: number, filterBy: string) =>
  `${BASE_URL}/auth/users-admins?page=${currentPage}&filterBy=${filterBy}`;
// `https://api-api-arab.azurewebsites.net/auth/make-admin/${userId}`,
export const MAKE_ADMIN_URL = (userId: string) =>
  `${BASE_URL}/auth/make-admin/${userId}`;
//`https://food-yumdrop0.azurewebsites.net/auth/users/${userId}`,
export const DELETE_USER_URL = (userId: string) =>
  `${BASE_URL}/auth/users/${userId}`;
// `https:/food-yumdrop0.azurewebsites.net/auth/admins/${adminId}`,
export const DELETE_ADMIN_URL = (adminId: string) =>
  `${BASE_URL}/auth/admins/${adminId}`;

//`https://food-yumdrop0.azurewebsites.net/api/menu?page=${page}&limit=${itemsPerPage}&search=${searchQuery}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`
export const FETCH_MENU_ITEMS_URL = (
  page: number,
  itemsPerPage: number,
  searchQuery: string,  
  sortColumn: string,
  sortDirection: string
) =>
  `${BASE_URL}/api/menu?page=${page}&limit=${itemsPerPage}&search=${searchQuery}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;

//`https://food-yumdrop0.azurewebsites.net/api/menu/${deletingCatId}`
export const DELETE_CATEGORY_URL = (deletingCatId: string) =>
  `${BASE_URL}/api/menu/${deletingCatId}`;

//  "https://api-api-arab.azurewebsites.net/api/categories"
export const ADD_CATEGORY_URL = `${BASE_URL}/api/categories`;

// `https://api-api-arab.azurewebsites.net/api/menu/${itemId}`,
export const DELETE_MENU_ITEM_URL = (itemId: string) =>
  `${BASE_URL}/api/menu/${itemId}`;

//"https://api-api-arab.azurewebsites.net/orders/recent-orders"
export const FETCH_RECENT_ORDERS_URL = `${BASE_URL}/orders/recent-orders`;

// "https://food-yumdrop0.azurewebsites.net/orders/most-ordered-items"
export const FETCH_MOST_ORDERED_ITEMS_URL = `${BASE_URL}/orders/most-ordered-items`;
  
      
        
        
