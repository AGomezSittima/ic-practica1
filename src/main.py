import pygame
import sys
from visual import Visual

# Definir colores
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Iniciamos pygame
pygame.init()
pygame.display.set_caption("Algoritmo A*")
# Definimos el tamaño de la pantalla
DEFAULT_SCREEN_WIDTH = 800
DEFAULT_SCREEN_HEIGHT = 500

# Creamos la primera pantalla
screen = pygame.display.set_mode(
    (DEFAULT_SCREEN_WIDTH, DEFAULT_SCREEN_HEIGHT), pygame.RESIZABLE)
clock = pygame.time.Clock()
fps = 60


def quit_game():
    pygame.quit()
    sys.exit()


# Iniciamos el bucle que mantendra la pantalla abierta
visual = Visual(screen, pygame.font.SysFont("arialblack", 40), quit_game)
visual.show()
while True:
    screen.fill((52, 78, 91))

    # Manejador de eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            quit_game()

        if event.type == pygame.VIDEORESIZE:
            screen = pygame.display.set_mode(
                (event.w, event.h), pygame.RESIZABLE)

            visual.update(screen)

    # Actualizamos la pantalla
    visual.process()
    pygame.display.update()
    clock.tick(fps)
