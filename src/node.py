import pygame

# COLORS
LINE_COLOR = (100, 100, 100)
NORMAL = (250,  250, 240) 
BARRIER = (20, 20, 20)
START = (250,0,0)
END = (255,170,0)
BORDER = (87,135,90)
VISITED = (110,175,85)
PATH = (186, 205, 0)

class Node:
    def __init__(self, row, col, width, rows):
        self.row = row
        self.col = col
        self.x = col * width
        self.y = row * width
        self.state = "Normal"
        self.color = self.get_color()
        self.width = width
        self.rows = rows
        self.G = 99999
        self.H = 99999

    def get_color(self):
        if self.state == "Normal":
            return NORMAL
        elif self.state == "Barrier":
            return BARRIER
        elif self.state == "Start":
            return START
        elif self.state == "End":
            return END
        elif self.state == "Border":
            return BORDER
        elif self.state == "Visited":
            return VISITED
        elif self.state == "Path":
            return PATH

    def get_width(self):
        return self.width

    def set_state(self, state):
        self.state = state
        self.color = self.get_color()

    def get_state(self):
        return self.state

    def draw(self, screen):
        pygame.draw.rect(screen, self.color, (self.x, self.y, self.width, self.width))

    def update_neighbours(self, nodes):
        self.neighbours = []
        # Get UP, DOWN, LEFT, RIGHT neighbours (Barries not allowed):
        if self.row != 0 and nodes[self.row - 1][self.col].get_state() != "Barrier": # UP
            self.neighbours.append(nodes[self.row - 1][self.col]) 

        if self.row < self.rows - 1 and nodes[self.row + 1][self.col].get_state() != "Barrier": # DOWN
            self.neighbours.append(nodes[self.row + 1][self.col]) 

        if self.col != 0 and nodes[self.row][self.col - 1].get_state() != "Barrier": # LEFT
            self.neighbours.append(nodes[self.row][self.col - 1]) 

        if self.col < self.rows - 1 and nodes[self.row][self.col + 1].get_state() != "Barrier": # RIGHT
            self.neighbours.append(nodes[self.row][self.col + 1])

        if self.row != 0 and self.col < self.rows and nodes[self.row - 1][self.col + 1].get_state() != "Barrier": # UP RIGHT
            self.neighbours.append(nodes[self.row - 1][self.col + 1]) 

        if self.row != 0 and self.col != 0 and nodes[self.row - 1][self.col - 1].get_state() != "Barrier": # UP LEFT
            self.neighbours.append(nodes[self.row - 1][self.col - 1]) 

        if self.row < self.rows - 1 and self.col < self.rows - 1 and nodes[self.row + 1][self.col + 1].get_state() != "Barrier": # DOWN RIGHT
            self.neighbours.append(nodes[self.row + 1][self.col + 1]) 

        if self.row < self.rows - 1 and self.col != 0 and nodes[self.row + 1][self.col - 1].get_state() != "Barrier": # DOWN LEFT
            self.neighbours.append(nodes[self.row + 1][self.col - 1])

    def set_parent(self, node):
        self.parent = node

    def restart_G(self):
        self.G = 0

    def set_G(self):
        self.G = self.parent.G + self.distance_to(self.parent)

    def set_H(self, node):
        self.H = self.distance_to(node) 

    def set_F(self):
        self.F = self.G + self.H

    def distance_to(self, node):
        x2, y2 = node.get_coords()
        return (abs(self.x - x2) + abs(self.y - y2)) 

    def get_coords(self):
        return self.x, self.y
