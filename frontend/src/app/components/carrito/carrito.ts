import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent implements OnInit {
  // Datos volátiles que viven solo en el navegador del usuario
  items: any[] = [];

  ngOnInit() {
    this.cargarCarrito();
  }

  // Función para simular el envío y limpiar el error de compilación
  enviarSolicitud() {
    alert('✅ Solicitud enviada (Simulación). El administrador revisará tu pedido en el sistema MBD.');
    this.vaciarCarrito();
  }
  
  cargarCarrito() {
    const data = localStorage.getItem('carrito_mbd');
    this.items = data ? JSON.parse(data) : [];
  }

  eliminarItem(id: number) {
    this.items = this.items.filter(i => i.id !== id);
    this.guardar();
  }

  vaciarCarrito() {
    this.items = [];
    this.guardar();
  }

  guardar() {
    localStorage.setItem('carrito_mbd', JSON.stringify(this.items));
  }
}