class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def set_width(self, width):
        self.width = width

    def set_height(self, height):
        self.height = height

    def get_area(self):
        return self.width * self.height

    def get_perimeter(self):
        return 2 * (self.width + self.height)

    def get_diagonal(self):
        return (self.width**2 + self.height**2) ** 0.5

    def get_picture(self):
        if self.width > 50 or self.height > 50:
            return "Too big for picture."
        return ("*" * self.width + "\n") * self.height

    def get_amount_inside(self, shape):
        horizontal_fit = self.width // shape.width
        vertical_fit = self.height // shape.height
        return horizontal_fit * vertical_fit

    def __str__(self):
        return f"Rectangle(width={self.width}, height={self.height})"

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)

    def set_side(self, side):
        self.width = side
        self.height = side

    def set_width(self, width):
        self.set_side(width)

    def set_height(self, height):
        self.set_side(height)

    def __str__(self):
        return f"Square(side={self.width})"

def calculate_metrics(type_a, a_w, a_h, a_s, type_b, b_w, b_h, b_s):
    """Bridge function called directly by JavaScript via Pyodide."""
    if type_a == "rectangle":
        shape_a = Rectangle(int(a_w), int(a_h))
    else:
        shape_a = Square(int(a_s))

    if type_b == "rectangle":
        shape_b = Rectangle(int(b_w), int(b_h))
    else:
        shape_b = Square(int(b_s))

    return {
        "area": shape_a.get_area(),
        "perimeter": shape_a.get_perimeter(),
        "diagonal": round(shape_a.get_diagonal(), 2),
        "fits": shape_a.get_amount_inside(shape_b),
        "repr": str(shape_a),
        "picture": shape_a.get_picture(),
    }