def load_pydl(file_path):
    config = {}
    with open(file_path, "r") as file:
        current_section = None
        for line in file:
            line = line.strip()

            # Skip comments and empty lines
            if line.startswith("//") or not line:
                continue

            if line.endswith(":"):  # Section header
                current_section = line[:-1]
                config[current_section] = {}
            else:  # Key-value pair
                key, value = line.split(">", 1)
                key = key.strip()
                value = value.strip().strip('"')  # Remove quotes
                # Convert booleans and numbers
                if value.lower() == "true":
                    value = True
                elif value.lower() == "false":
                    value = False
                elif value.lower() == "null":
                    value = None
                elif value.isdigit():
                    value = int(value)
                elif value.replace(".", "", 1).isdigit():
                    value = float(value)

                if current_section:
                    config[current_section][key] = value
                else:
                    config[key] = value
    return config
