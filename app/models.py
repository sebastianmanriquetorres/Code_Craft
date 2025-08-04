class Proyecto:
    """
    Clase que representa un proyecto en Code_Craft.
    """

    def __init__(self, nombre_proyecto):
        self.nombre_proyecto = nombre_proyecto

    def obtener_detalles(self):
        """
        Retorna los detalles del proyecto.
        """
        return self.nombre_proyecto
