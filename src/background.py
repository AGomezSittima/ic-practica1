import pygame, random

WHITE = (255, 255, 255)

class Background():
    def __init__(self, num):
        self.num = num
        self.point = []
        for i in range(num):
            x = random.randint(0, 800) 
            y = random.randint(0, 500)
            self.point.append([x, y])   

    def process(self, screen):        
        for i in range(self.num):
            self.point[i][1]+=1
            pygame.draw.circle(screen, WHITE, self.point[i], 2 )
            if(self.point[i][1] >= 500):
                self.point[i][0] = random.randint(0, 800) 
                self.point[i][1] = 0