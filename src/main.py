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
# -----------------------------------
# COLORS
LINE_COLOR = (100, 100, 100)
NORMAL = (250,  250, 240) 
BARRIER = (20, 20, 20)
START = (250,0,0)
END = (255,170,0)
BORDER = (87,135,90)
VISITED = (110,175,85)
PATH = (186, 205, 0)



def a_star(draw, start_node, end_node, nodes):
    
    borders = []
    visited = []
    finished = False

    start_node.set_parent(start_node)
    start_node.restart_G()
    start_node.set_H(end_node)
    start_node.set_F()
    borders.append(start_node)

    iteration = 0

    while len(borders) != 0 and not finished:
        draw()
        iteration += 1
        borders.sort(key = lambda x: x.F, reverse=True)
        node = borders.pop()
        visited.append(node)
        node.set_state("Visited")
        print("Iteration:", iteration)
        print("Node G:", node.G)
        print("Node H:", node.H)
        print("Node F:", node.F)
        print("")

        if node == end_node:
            finished = True
            print("Solution found")
            #draw backwards path
            draw_path(end_node, start_node)

        else:
            #neighbours = node.get_neighbours(nodes)
            node.update_neighbours(nodes)
            for neighbour in node.neighbours:
                if neighbour not in visited and neighbour not in borders:
                    neighbour.set_parent(node)
                    neighbour.set_G()
                    neighbour.set_H(end_node)
                    neighbour.set_F()
                    neighbour.set_state("Border")
                    borders.append(neighbour)

        time.sleep(0.05)
        draw()
    if not finished:
        print("No solution found")
    print("Exiting A star")


def draw_path(end_node, start_node):
    not_found = True
    node = end_node.parent
    end_node.set_state("End")

    while not_found:
        if node == start_node:
            print("found start_node")
            not_found = False
            node.set_state("Start")
        else:
            node.set_state("Path")
            node = node.parent



def make_nodes(rows, width):
    nodes = []
    size = width // rows
    for y in range(rows):
        nodes.append([])
        for x in range(rows):
            node = Node(y, x, size, rows)
            nodes[y].append(node)
    return nodes


def restart_nodes_state(state, nodes):
    for row_of_nodes in nodes:
        for node in row_of_nodes:
            if node.get_state() == state:
                node.set_state("Normal")


def draw_board(screen, rows, width):
    gap = width // rows
    for x in range(1, rows):
        pygame.draw.line(screen, LINE_COLOR, (gap*x, 0), (gap*x, width), 2) # Last item == line.weight = 1 by default
    for y in range(1, rows):
        pygame.draw.line(screen, LINE_COLOR, (0, gap*y), (width, gap*y), 2)


def draw_nodes(screen, nodes):
    for row_of_nodes in nodes:
        for node in row_of_nodes:
                node.draw(screen)


def get_pos(posXY, width, rows):
    pos_x, pos_y = posXY
    node_width = width // rows
    x = pos_x // node_width
    y = pos_y // node_width
    return x, y

def draw(screen, rows, width, nodes):
    draw_nodes(screen, nodes)
    draw_board(screen, rows, width)
    pygame.display.update()



# ----------------------------------
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
