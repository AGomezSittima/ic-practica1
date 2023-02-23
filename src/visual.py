from background import Background
from button import Button
from enum import Enum


class Scene(Enum):
    Menu = 0
    Main = 1


class Visual:
    def __init__(self, screen, font, on_quit=None):
        # Definimos las fuentes
        self.font = font
        # Definimos el color de letra
        self.TEXT_COL = (255, 255, 255)
        self.objects_to_proccess = []
        self.screen = screen
        self.screen_width = screen.get_width()
        self.screen_height = screen.get_height()
        self.scene = Scene.Menu
        self.on_quit = on_quit

    def draw_text(self, text, font, text_col, x, y, pivot_center=True):
        text = font.render(text, True, text_col)
        size = text.get_size()

        result_x = x if not pivot_center else x - size[0] / 2
        result_y = y if not pivot_center else y - size[1] / 2

        self.screen.blit(text, (result_x, result_y))

    def show_menu_scene(self, screen_width, screen_height):
        self.objects_to_proccess.clear()

        self.objects_to_proccess.append(Background(50))

        self.draw_text("A* ALGORITHM", self.font, self.TEXT_COL,
                       screen_width / 2, 100)
        start_button = Button(
            screen_width / 2, 200, 200, 75, self.font, 'Start', self.start_button_on_click)
        quit_button = Button(
            screen_width / 2, 300, 200, 75, self.font, 'Quit', self.on_quit)

        self.objects_to_proccess.append(start_button)
        self.objects_to_proccess.append(quit_button)

    def show_main_scene(self, screen_width, screen_height):
        self.objects_to_proccess.clear()

        back_button = Button(
            screen_width / 2, 300, 200, 75, self.font, 'Back', self.back_button_on_click)

        self.objects_to_proccess.append(back_button)

    def start_button_on_click(self):
        self.scene = Scene.Main

        self.update(self.screen)

    def back_button_on_click(self):
        self.scene = Scene.Menu

        self.update(self.screen)

    def show(self):
        if self.scene == Scene.Menu:
            self.show_menu_scene(self.screen_width, self.screen_height)
        elif self.scene == Scene.Main:
            self.show_main_scene(self.screen_width, self.screen_height)

    def process(self):
        for object_to_process in self.objects_to_proccess:
            object_to_process.process(self.screen)

    def update(self, screen):
        self.screen = screen
        self.screen_width = screen.get_width()
        self.screen_height = screen.get_height()

        self.show()
