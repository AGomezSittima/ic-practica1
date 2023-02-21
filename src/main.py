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

def showMenu():
    objects.clear()

    objects.append(background)

    startButton = button.Button(300, 200, 200, 75, font,'Start', start_button_on_click)
    quitButton = button.Button(300, 300, 200, 75, font,'Quit', quit_game)
    
    objects.append(startButton)
    objects.append(quitButton)

def showAlgorithmScreen():
    objects.clear()

    quitButton = button.Button(300, 300, 200, 75, font,'Quit', quit_game)

    objects.append(quitButton)

def start_button_on_click():
    showAlgorithmScreen()


def quit_game():
    pygame.quit()

# Iniciamos el bucle que mantendra la pantalla abierta

showMenu()
while True:
    screen.fill((52, 78, 91))

    draw_text("A* ALGORITHM", font, TEXT_COL, 240, 100)

    # Manejador de eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            quit_game()
    
    for object in objects:
        object.process(screen)
     

    # Actualizamos la pantalla
    pygame.display.update()
    clock.tick(fps)