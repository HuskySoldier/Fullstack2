// src/tienda/js/types.ts

export interface User {
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  pass: string;
  fnac: string;
  rol: 'Administrador' | 'Vendedor' | 'Cliente';
  region: string;
  comuna: string;
  dir: string;
}

export interface Product {
  id: string;
  nombre: string;
  precio: number;
  features: string[];
  img: string;
}

export interface Blog {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  img: string;
  fecha: string;
  autor: string;
}

export interface SessionUser {
  nombre: string;
  email: string; // <-- Añadido para el checkout
  rol: 'Administrador' | 'Vendedor' | 'Cliente';
  // ...otras propiedades que pueda tener
}

// Tipo para los productos como vienen de localStorage (antes de parsear)
export interface SavedProduct {
  codigo?: string;
  id: string;
  nombre: string;
  precio: string;
  img: string;
  desc?: string;
}

// NUEVOS TIPOS PARA EL CARRITO
export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  user: string | null; // email del usuario o null
}