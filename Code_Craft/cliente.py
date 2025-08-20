from plyer import notification
import webbrowser
import threading
import time

class cliente:

    
    def __init__(self, caja_nombre, caja_correo,caja_telefono, caja_info_bancaria, caja_id_cliente, caja_proyectos, caja_contrasena):

        self.nombre = caja_nombre
        self.correo = caja_correo
        self.telefono = caja_telefono
        self.info_bancaria = caja_info_bancaria
        self.id_cliente = caja_id_cliente
        self.proyectos = caja_proyectos
        self.contrasena = caja_contrasena


    def iniciar_sesion (self, contrasena_ingresada):
        for cliente in cliente.base_datos_clientes:
            if cliente.correo == self.correo:
                if cliente.contrasena == contrasena_ingresada:
            
                    print(f"<Bienvenido de nuevo, {self.nombre}. se inicio sesiòn correctamente>")
                return

    def registrarse (self)
        for cliente in cliente.base_datos_clientes:
            if cliente.correo == self.correo:
                print("Ya existe un cliente con este correo.")
                return
        
        cliente.base_datos_clientes.append(self)



            