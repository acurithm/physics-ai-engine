# tools.py
def solve_physics(u, v, t):
    try:
        # Agar user string (abc) daal de toh float() error dega
        u, v, t = float(u), float(v), float(t)
        if t == 0: return "Error: Time cannot be zero"
        a = (v - u) / t
        return f"Acceleration: {a} m/s^2"
    except ValueError:
        return "Error: Please enter valid numbers."

def calculate_distance(u, t, a):
    try:
        u, t, a = float(u), float(t), float(a)
        s = (u * t) + (0.5 * a * (t**2))
        return f"Distance: {s} meters"
    except ValueError:
        return "Error: Please enter valid numbers."