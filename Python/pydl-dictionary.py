# Load PyDonfig file
config = load_pydl("config.pydl")

# Access values
print(config["device"]["macAddress"])  # Output: 00:00:00:00:00:00
print(config["dns"]["primary"])        # Output: 127.0.0.1
print(config["firewallRule"]["deny"])  # Output: True