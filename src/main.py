import pygame, random
import button
import background

#Definir colores
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Iniciamos pygame
pygame.init()
# Definimos el tamaño de la pantalla
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 500

# Creamos la primera pantalla 
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
clock = pygame.time.Clock()
pygame.display.set_caption("Main Menu")
fps = 60
objects = []

# Definimos las fuentes
font = pygame.font.SysFont("arialblack", 40)
# Definimos el color de letra
TEXT_COL = (255, 255, 255)

background = background.Background(50);

def draw_text(text, font, text_col, x, y):
    img = font.render(text, True, text_col)
    screen.blit(img, (x, y))

def myFunction():
        print("hola")
# Iniciamos el bucle que mantendra la pantalla abierta
run = True
while run:
    screen.fill((52, 78, 91))

    background.draw(screen)
    
    draw_text("A* ALGORITHM", font, TEXT_COL, 240, 100)
    
    customButton = button.Button(30, 30, 400, 100, font,'Button One (onePress)', myFunction)
   
    customButton.process(screen)


    # Manejador de eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
     

    # Actualizamos la pantalla
    pygame.display.update()
    clock.tick(fps)

pygame.quit()